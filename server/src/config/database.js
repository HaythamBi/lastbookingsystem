import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../../database.sqlite');

let db = null;

export async function getDb() {
  if (!db) {
    // Ensure the database file exists
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, ''); // Create empty file if it doesn't exist
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

export async function setupDatabase() {
  // If database file exists, delete it to start fresh
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = await getDb();
  
  try {
    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone_number TEXT UNIQUE NOT NULL,
        email TEXT,
        role TEXT NOT NULL DEFAULT 'customer'
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        worker_id TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status TEXT NOT NULL,
        machine_id INTEGER NOT NULL,
        notes TEXT,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (worker_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS clinic_hours_by_date (
        date TEXT PRIMARY KEY,
        is_open INTEGER NOT NULL DEFAULT 1,
        open_time TEXT NOT NULL DEFAULT '09:00',
        close_time TEXT NOT NULL DEFAULT '17:00',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default clinic hours for current month
    await db.exec(`
      INSERT OR IGNORE INTO clinic_hours_by_date (date, is_open, open_time, close_time)
      SELECT 
        date(datetime('now', 'start of month', '+' || (seq.i - 1) || ' days')) as date,
        1 as is_open,
        '09:00' as open_time,
        '17:00' as close_time
      FROM (
        WITH RECURSIVE seq(i) AS (
          SELECT 1
          UNION ALL
          SELECT i + 1 FROM seq
          WHERE i < (SELECT strftime('%d', datetime('now', 'start of month', '+1 month', '-1 day')))
        )
        SELECT i FROM seq
      ) seq;
    `);

    // Insert test users in development
    if (process.env.NODE_ENV === 'development') {
      await db.run(`
        INSERT OR IGNORE INTO users (id, name, phone_number, email, role)
        VALUES 
          ('admin-1', 'Admin User', '+1234567890', 'admin@example.com', 'admin'),
          ('worker-1', 'Test Worker', '+1234567891', 'worker@example.com', 'worker'),
          ('customer-1', 'Test Customer', '+1234567892', 'customer@example.com', 'customer')
      `);
    }

    console.log('Database setup completed successfully');
    return db;
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

export async function closeDb() {
  if (db) {
    await db.close();
    db = null;
  }
}