import { Router } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository.js';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController(new UserRepository());

router.get('/email/:email', userController.getByEmail);

export default router;
