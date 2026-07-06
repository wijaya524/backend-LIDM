import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { sendError } from './utils/response.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging in development environment
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Handle unknown route URLs (404)
app.use((req, res) => {
  return sendError(res, `Endpoint tidak ditemukan: ${req.originalUrl}`, 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
