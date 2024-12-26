import { TABLES } from './schema.js';

export const SEED_DATA = {
  [TABLES.USERS]: `
    INSERT OR IGNORE INTO ${TABLES.USERS} (id, name, phone_number, email, role)
    VALUES 
      ('admin-1', 'Admin User', '+1234567890', 'admin@example.com', 'admin'),
      ('worker-1', 'Test Worker', '+1234567891', 'worker@example.com', 'worker'),
      ('customer-1', 'Test Customer', '+1234567892', 'customer@example.com', 'customer')
  `,

  [TABLES.CLINIC_HOURS]: `
    INSERT OR IGNORE INTO ${TABLES.CLINIC_HOURS} (date, is_open, open_time, close_time)
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
    ) seq
  `
};