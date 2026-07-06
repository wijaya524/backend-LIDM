import { Router } from 'express';
import AnalyticsController from '../controllers/analyticsController.js';

const router = Router();

router.get('/:id', AnalyticsController.getAnalysisById);
router.get('/log/:log_id', AnalyticsController.getAnalysisByLog);
router.get('/user/:user_id', AnalyticsController.getAnalyticsByUser);

export default router;
