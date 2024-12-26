export const TABLES = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  CLINIC_HOURS: 'clinic_hours_by_date'
};

export const SCHEMAS = {
  [TABLES.USERS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone_number TEXT UNIQUE NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'customer'
    )
  `,
  
  [TABLES.BOOKINGS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.BOOKINGS} (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      worker_id TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      status TEXT NOT NULL,
      machine_id INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES ${TABLES.USERS}(id),
      FOREIGN KEY (worker_id) REFERENCES ${TABLES.USERS}(id)
    )
  `,
  
  [TABLES.CLINIC_HOURS]: `
    CREATE TABLE IF NOT EXISTS ${TABLES.CLINIC_HOURS} (
      date TEXT PRIMARY KEY,
      is_open INTEGER NOT NULL DEFAULT 1,
      open_time TEXT NOT NULL DEFAULT '09:00',
      close_time TEXT NOT NULL DEFAULT '17:00',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
};