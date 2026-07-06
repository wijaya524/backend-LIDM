import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { validateUser } from '../middlewares/validator.js';

const router = Router();

router.post('/', validateUser, UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validateUser, UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
