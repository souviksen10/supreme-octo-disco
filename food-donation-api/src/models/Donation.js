const { v4: uuidv4 } = require('uuid');

class Donation {
  constructor({
    donorName,
    contact,
    foodType,
    quantity,
    unit,
    expiryDate,
    location,
    notes,
    status = 'available'
  }) {
    this.id = uuidv4();
    this.donorName = donorName;
    this.contact = contact;
    this.foodType = foodType;
    this.quantity = quantity;
    this.unit = unit;
    this.expiryDate = expiryDate;
    this.location = location;
    this.notes = notes;
    this.status = status; // 'available', 'reserved', 'collected'
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Validate required fields
  static validate(donationData) {
    const required = ['donorName', 'contact', 'foodType', 'quantity', 'unit', 'expiryDate', 'location'];
    const missing = required.filter(field => !donationData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate status
    const validStatuses = ['available', 'reserved', 'collected'];
    if (donationData.status && !validStatuses.includes(donationData.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate quantity
    if (donationData.quantity && (isNaN(donationData.quantity) || donationData.quantity <= 0)) {
      throw new Error('Quantity must be a positive number');
    }

    // Validate expiry date
    if (donationData.expiryDate) {
      const expiryDate = new Date(donationData.expiryDate);
      if (isNaN(expiryDate.getTime())) {
        throw new Error('Invalid expiry date format');
      }
    }

    return true;
  }

  // Update donation properties
  update(updateData) {
    // Validate update data
    Donation.validate({ ...this, ...updateData });

    // Update properties
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        this[key] = updateData[key];
      }
    });

    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Convert to JSON (remove sensitive data if needed)
  toJSON() {
    return {
      id: this.id,
      donorName: this.donorName,
      contact: this.contact,
      foodType: this.foodType,
      quantity: this.quantity,
      unit: this.unit,
      expiryDate: this.expiryDate,
      location: this.location,
      notes: this.notes,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Donation; 