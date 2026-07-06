import { Router } from 'express';
import userRoutes from './userRoutes.js';
import logGameRoutes from './logGameRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

// Base health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Belajar Mandiri API. System is up and running!',
    timestamp: new Date().toISOString()
  });
});

// Register routes
router.use('/users', userRoutes);
router.use('/logs', logGameRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
