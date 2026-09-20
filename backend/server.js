import 'dotenv/config'; // Loads environment variables BEFORE importing app.js or db.js
import app from './src/app.js';
import pool from './src/config/db.js';

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log('Database pool closed.');
      } catch (err) {
        console.error('Error closing database pool:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Required for Vercel Serverless Functions
export default app;