import app from './src/app.js';
import { checkDbConnection } from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  console.log('Starting Belajar Mandiri backend server...');
  
  // Verify database connection first
  const dbConnected = await checkDbConnection();
  if (!dbConnected) {
    console.log(error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(` Server is running on port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api`);
    console.log(`================================================`);
  });
};

startServer();
