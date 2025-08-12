const path = require('path');
const database = require('../src/config/database');
const Donation = require('../src/models/Donation');

// Sample data arrays
const donorNames = [
  'John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
  'Lisa Anderson', 'Robert Taylor', 'Jennifer White', 'Christopher Martin', 'Amanda Thompson',
  'Daniel Garcia', 'Michelle Rodriguez', 'James Martinez', 'Ashley Lewis', 'Matthew Walker',
  'Jessica Hall', 'Anthony Allen', 'Nicole Young', 'Mark King', 'Stephanie Wright',
  'Steven Lopez', 'Rebecca Hill', 'Kevin Scott', 'Rachel Green', 'Brian Adams',
  'Laura Baker', 'Jason Gonzalez', 'Samantha Nelson', 'Ryan Carter', 'Kimberly Mitchell',
  'Eric Perez', 'Amy Roberts', 'Justin Turner', 'Elizabeth Phillips', 'Aaron Campbell',
  'Heather Parker', 'Jonathan Evans', 'Megan Edwards', 'Andrew Collins', 'Christina Stewart',
  'Joshua Sanchez', 'Melissa Morris', 'Nicholas Rogers', 'Angela Reed', 'Tyler Cook',
  'Sandra Bailey', 'Brandon Rivera', 'Vanessa Cooper', 'Gregory Richardson', 'Tiffany Cox'
];

const foodTypes = [
  'Fresh vegetables', 'Cooked meals', 'Bread and pastries', 'Canned goods', 'Fresh fruits',
  'Dairy products', 'Frozen meals', 'Rice and grains', 'Pasta', 'Snacks and crackers',
  'Soup', 'Sandwiches', 'Pizza', 'Salad', 'Meat products', 'Fish and seafood',
  'Desserts', 'Beverages', 'Baby food', 'Cereal', 'Nuts and dried fruits',
  'Leftover restaurant food', 'Bakery items', 'Prepared lunch boxes', 'Homemade cookies'
];

const units = ['meals', 'kg', 'boxes', 'pieces', 'liters', 'portions'];

const locations = [
  '123 Main Street, Downtown', '456 Oak Avenue, Westside', '789 Pine Road, Eastville',
  '321 Elm Street, Northtown', '654 Maple Drive, Southside', '987 Cedar Lane, Midtown',
  '147 Birch Avenue, Riverside', '258 Spruce Street, Hillside', '369 Willow Road, Parkview',
  '741 Ash Drive, Lakeside', '852 Cherry Lane, Woodland', '963 Poplar Street, Greenfield',
  '159 Hickory Avenue, Fairview', '357 Walnut Road, Brookside', '468 Chestnut Drive, Valley View',
  '579 Sycamore Street, Mountain View', '681 Magnolia Lane, Garden City', '792 Cypress Avenue, Sunrise',
  '814 Redwood Road, Sunset', '925 Sequoia Drive, Pine Valley'
];

const notes = [
  'Please collect before evening', 'Fresh from today\'s cooking', 'Best before tomorrow',
  'Call before pickup', 'Available after 3 PM', 'Vegetarian options available',
  'Includes utensils', 'Still warm', 'Gluten-free options', 'Organic produce',
  'From local restaurant', 'Homemade with love', 'Perfect for families',
  'Easy to transport', 'No allergens', null, null, null, null, null
];

const statuses = ['available', 'reserved', 'collected'];

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random date within next 7 days
function getRandomExpiryDate() {
  const today = new Date();
  const futureDate = new Date(today.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0];
}

// Helper function to get random past date for createdAt
function getRandomCreatedDate() {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
}

// Helper function to generate phone or email
function getRandomContact() {
  const contactTypes = [
    () => `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    () => `user${Math.floor(Math.random() * 1000)}@example.com`,
    () => `${getRandomItem(donorNames).toLowerCase().replace(' ', '.')}@gmail.com`
  ];
  return getRandomItem(contactTypes)();
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Initialize database
    await database.initialize();
    
    console.log('Adding 50 dummy donation records...');
    
    for (let i = 0; i < 50; i++) {
      const createdAt = getRandomCreatedDate();
      const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString();
      
      const donationData = {
        donorName: getRandomItem(donorNames),
        contact: getRandomContact(),
        foodType: getRandomItem(foodTypes),
        quantity: Math.floor(Math.random() * 20) + 1,
        unit: getRandomItem(units),
        expiryDate: getRandomExpiryDate(),
        location: getRandomItem(locations),
        notes: getRandomItem(notes),
        status: getRandomItem(statuses)
      };

      // Create donation object
      const donation = new Donation(donationData);
      
      // Override timestamps for variety
      donation.createdAt = createdAt;
      donation.updatedAt = updatedAt;

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
      
      if ((i + 1) % 10 === 0) {
        console.log(`Inserted ${i + 1} records...`);
      }
    }

    console.log('✅ Successfully added 50 dummy donation records!');
    
    // Verify the count
    const countResult = database.query('SELECT COUNT(*) as total FROM donations');
    console.log(`📊 Total donations in database: ${countResult[0].total}`);
    
    // Show status breakdown
    const statusResult = database.query(`
      SELECT status, COUNT(*) as count 
      FROM donations 
      GROUP BY status
    `);
    
    console.log('📈 Status breakdown:');
    statusResult.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    database.close();
  }
}

// Run the seeding
seedDatabase(); 