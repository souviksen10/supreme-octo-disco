const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { asyncHandler } = require('../middleware/errorMiddleware');
const database = require('../config/database');

/**
 * @swagger
 * /api/v1/donations:
 *   get:
 *     summary: Get all donations
 *     description: Retrieve a list of all donations with optional filtering
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, reserved, collected]
 *         description: Filter by donation status
 *       - in: query
 *         name: foodType
 *         schema:
 *           type: string
 *         description: Filter by food type (case insensitive)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (case insensitive)
 *     responses:
 *       200:
 *         description: List of donations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donation'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Get all donations
// @route   GET /api/v1/donations
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { status, foodType, location } = req.query;
  
  // Build SQL query with filters
  let sql = 'SELECT * FROM donations WHERE 1=1';
  const params = [];

  // Filter by status
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  // Filter by food type (case insensitive)
  if (foodType) {
    sql += ' AND LOWER(foodType) LIKE ?';
    params.push(`%${foodType.toLowerCase()}%`);
  }

  // Filter by location (case insensitive)
  if (location) {
    sql += ' AND LOWER(location) LIKE ?';
    params.push(`%${location.toLowerCase()}%`);
  }

  // Sort by creation date (newest first)
  sql += ' ORDER BY createdAt DESC';

  const donations = database.query(sql, params);

  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations
  });
}));

/**
 * @swagger
 * /api/v1/donations/stats/summary:
 *   get:
 *     summary: Get donation statistics
 *     description: Retrieve statistical summary of all donations
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalDonations:
 *                       type: integer
 *                       description: Total number of donations
 *                       example: 51
 *                     statusBreakdown:
 *                       type: object
 *                       properties:
 *                         available:
 *                           type: integer
 *                           description: Number of available donations
 *                           example: 21
 *                         reserved:
 *                           type: integer
 *                           description: Number of reserved donations
 *                           example: 13
 *                         collected:
 *                           type: integer
 *                           description: Number of collected donations
 *                           example: 17
 *                     foodTypeDistribution:
 *                       type: object
 *                       description: Distribution of donations by food type
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         "Fresh vegetables": 5
 *                         "Cooked meals": 3
 *                         "Bread": 2
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Get donation statistics
// @route   GET /api/v1/donations/stats/summary
// @access  Public
router.get('/stats/summary', asyncHandler(async (req, res) => {
  // Get total donations count
  const totalResult = database.query('SELECT COUNT(*) as total FROM donations');
  const totalDonations = totalResult[0]?.total || 0;

  // Get status breakdown
  const statusResult = database.query(`
    SELECT status, COUNT(*) as count 
    FROM donations 
    GROUP BY status
  `);
  
  const statusBreakdown = {
    available: 0,
    reserved: 0,
    collected: 0
  };
  
  statusResult.forEach(row => {
    if (row.status in statusBreakdown) {
      statusBreakdown[row.status] = row.count;
    }
  });

  // Get food type distribution
  const foodTypeResult = database.query(`
    SELECT foodType, COUNT(*) as count 
    FROM donations 
    GROUP BY foodType
  `);
  
  const foodTypes = {};
  foodTypeResult.forEach(row => {
    foodTypes[row.foodType] = row.count;
  });

  res.status(200).json({
    success: true,
    data: {
      totalDonations,
      statusBreakdown,
      foodTypeDistribution: foodTypes
    }
  });
}));

/**
 * @swagger
 * /api/v1/donations/{id}:
 *   get:
 *     summary: Get a single donation
 *     description: Retrieve details of a specific donation by ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique donation ID
 *     responses:
 *       200:
 *         description: Donation details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       404:
 *         description: Donation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Get single donation
// @route   GET /api/v1/donations/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const donation = database.get('SELECT * FROM donations WHERE id = ?', [req.params.id]);

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  res.status(200).json({
    success: true,
    data: donation
  });
}));

/**
 * @swagger
 * /api/v1/donations:
 *   post:
 *     summary: Create a new donation
 *     description: Create a new food donation entry
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationInput'
 *     responses:
 *       201:
 *         description: Donation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Donation created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Create new donation
// @route   POST /api/v1/donations
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  try {
    // Validate request body
    Donation.validate(req.body);

    // Create new donation
    const donation = new Donation(req.body);
    
    // Insert into database
    const sql = `
      INSERT INTO donations (
        id, donorName, contact, foodType, quantity, unit,
        notes, expiryDate, location, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      donation.id,
      donation.donorName,
      donation.contact,
      donation.foodType,
      donation.quantity,
      donation.unit,
      donation.notes,
      donation.expiryDate,
      donation.location,
      donation.status,
      donation.createdAt,
      donation.updatedAt
    ];

    database.run(sql, params);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}));

/**
 * @swagger
 * /api/v1/donations/{id}:
 *   put:
 *     summary: Update a donation
 *     description: Update all fields of an existing donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique donation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/DonationInput'
 *               - type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [available, reserved, collected]
 *                     description: Status of the donation
 *     responses:
 *       200:
 *         description: Donation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Donation updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Donation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Update donation
// @route   PUT /api/v1/donations/:id
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  // Check if donation exists
  const existingDonation = database.get('SELECT * FROM donations WHERE id = ?', [req.params.id]);

  if (!existingDonation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  try {
    // Create donation object to get updated values
    const donationObj = new Donation(existingDonation);
    const updatedDonation = donationObj.update(req.body);
    
    // Update in database
    const sql = `
      UPDATE donations SET
        donorName = ?, contact = ?, foodType = ?,
        quantity = ?, unit = ?, notes = ?, expiryDate = ?,
        location = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `;
    
    const params = [
      updatedDonation.donorName,
      updatedDonation.contact,
      updatedDonation.foodType,
      updatedDonation.quantity,
      updatedDonation.unit,
      updatedDonation.notes,
      updatedDonation.expiryDate,
      updatedDonation.location,
      updatedDonation.status,
      updatedDonation.updatedAt,
      req.params.id
    ];

    database.run(sql, params);

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      data: updatedDonation
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}));

/**
 * @swagger
 * /api/v1/donations/{id}/status:
 *   patch:
 *     summary: Update donation status
 *     description: Update only the status of an existing donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique donation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, reserved, collected]
 *                 description: New status for the donation
 *                 example: "reserved"
 *     responses:
 *       200:
 *         description: Donation status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Donation status updated to reserved"
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid status or missing status field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Donation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Update donation status
// @route   PATCH /api/v1/donations/:id/status
// @access  Public
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }

  // Check if donation exists
  const existingDonation = database.get('SELECT * FROM donations WHERE id = ?', [req.params.id]);

  if (!existingDonation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  try {
    // Create donation object to get updated values
    const donationObj = new Donation(existingDonation);
    const updatedDonation = donationObj.update({ status });
    
    // Update only the status and updatedAt in database
    const sql = 'UPDATE donations SET status = ?, updatedAt = ? WHERE id = ?';
    const params = [updatedDonation.status, updatedDonation.updatedAt, req.params.id];

    database.run(sql, params);

    res.status(200).json({
      success: true,
      message: `Donation status updated to ${status}`,
      data: updatedDonation
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}));

/**
 * @swagger
 * /api/v1/donations/{id}:
 *   delete:
 *     summary: Delete a donation
 *     description: Permanently delete a donation from the system
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique donation ID
 *     responses:
 *       200:
 *         description: Donation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Donation deleted successfully"
 *       404:
 *         description: Donation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Delete donation
// @route   DELETE /api/v1/donations/:id
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  // Check if donation exists
  const existingDonation = database.get('SELECT * FROM donations WHERE id = ?', [req.params.id]);

  if (!existingDonation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Delete from database
  database.run('DELETE FROM donations WHERE id = ?', [req.params.id]);

  res.status(200).json({
    success: true,
    message: 'Donation deleted successfully'
  });
}));



module.exports = router; 