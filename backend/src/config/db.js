import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable SSL for cloud databases (Aiven, PlanetScale, etc.)
  // Set DB_SSL=false in .env to disable for local development
  ...(process.env.DB_SSL !== 'false' && {
    ssl: { rejectUnauthorized: false }
  })
});

export default pool;