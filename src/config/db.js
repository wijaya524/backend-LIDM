import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'belajar_mandiri',
  // Max number of clients in pool
  max: 10,
  // Time a client can remain idle before being closed
  idleTimeoutMillis: 30000,
  // Connection timeout
  connectionTimeoutMillis: 5000,
};

const pool = new Pool(dbConfig);

// Helper to run query with automatic client retrieval and release
export const query = (text, params) => {
  return pool.query(text, params);
};

// Check database connection on startup with simple retry logic
export const checkDbConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await query('SELECT NOW()');
      console.log(`Database connected successfully at: ${res.rows[0].now}`);
      return true;
    } catch (err) {
      console.error(`Database connection failed (Attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

export default pool;
