import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/Authenticate.js';
import ProfileController from '../controllers/ProfileController.js';
import authMiddleWare from '../middlewares/Authenticate.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);



// profile
router.get('/profile', authMiddleware, ProfileController.index);
router.put('/profile/:id', authMiddleWare, ProfileController.update);

export default router;