import fs from 'fs';
import { getConnection } from './connection.js';
import { SCHEMAS } from './schema.js';
import { SEED_DATA } from './seed.js';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || 'database.sqlite';

export async function setupDatabase() {
  // Delete existing database if it exists
  if (fs.existsSync(dbPath)) {
    console.log('Removing existing database...');
    fs.unlinkSync(dbPath);
  }

  console.log('Setting up new database...');
  const db = await getConnection();

  try {
    // Create tables
    for (const [table, schema] of Object.entries(SCHEMAS)) {
      console.log(`Creating table: ${table}`);
      await db.exec(schema);
    }

    // Seed data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Seeding development data...');
      for (const [table, seedQuery] of Object.entries(SEED_DATA)) {
        console.log(`Seeding table: ${table}`);
        await db.exec(seedQuery);
      }
    }

    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}