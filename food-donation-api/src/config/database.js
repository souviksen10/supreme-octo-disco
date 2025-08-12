const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../database/donations.db');
  }

  async initialize() {
    try {
      // Initialize sql.js
      const SQL = await initSqlJs();
      
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Check if database file exists and load it
      let filebuffer;
      try {
        if (fs.existsSync(this.dbPath)) {
          filebuffer = fs.readFileSync(this.dbPath);
        }
      } catch (err) {
        console.warn('Could not read existing database file, starting fresh');
        filebuffer = null;
      }

      // Create database instance
      this.db = new SQL.Database(filebuffer);

      // Create tables if they don't exist
      this.createTables();
      
      // Save initial database
      this.saveDatabase();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  createTables() {
    const createDonationsTable = `
      CREATE TABLE IF NOT EXISTS donations (
        id TEXT PRIMARY KEY,
        donorName TEXT NOT NULL,
        contact TEXT NOT NULL,
        foodType TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT NOT NULL,
        notes TEXT,
        expiryDate TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'collected')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;

    this.db.run(createDonationsTable);
  }

  saveDatabase() {
    try {
      // Export database to binary array
      const data = this.db.export();
      
      // Write binary data to file
      fs.writeFileSync(this.dbPath, Buffer.from(data));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Execute a query and return results
  query(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      const results = [];
      
      // Bind parameters if any
      if (params.length > 0) {
        stmt.bind(params);
      }
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row);
      }
      
      stmt.free();
      return results;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  // Execute a statement (INSERT, UPDATE, DELETE)
  run(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      
      // Bind parameters if any
      if (params.length > 0) {
        stmt.bind(params);
      }
      
      const result = stmt.step();
      stmt.free();
      
      // Save database after any modification
      this.saveDatabase();
      
      return { changes: this.db.getRowsModified() };
    } catch (error) {
      console.error('Run error:', error);
      throw error;
    }
  }

  // Get a single row
  get(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      
      // Bind parameters if any
      if (params.length > 0) {
        stmt.bind(params);
      }
      
      let result = null;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      
      stmt.free();
      return result;
    } catch (error) {
      console.error('Get error:', error);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database; 