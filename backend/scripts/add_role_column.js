const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Adding role column to User table...');
    await pool.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Client';`);
    console.log('Role column added successfully.');
  } catch (error) {
    console.error('Error adding role column:', error);
  } finally {
    await pool.end();
  }
}

run();
