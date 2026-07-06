import { Router } from 'express';
import LogGameController from '../controllers/logGameController.js';
import { validateLog } from '../middlewares/validator.js';

const router = Router();

router.post('/', validateLog, LogGameController.createLog);
router.get('/:id', LogGameController.getLogById);
router.get('/user/:user_id', LogGameController.getLogsByUser);

export default router;
