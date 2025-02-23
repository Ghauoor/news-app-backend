import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/Authenticate.js';
import ProfileController from '../controllers/ProfileController.js';
import NewsController from '../controllers/NewsController.js';
import authMiddleWare from '../middlewares/Authenticate.js';

const router = Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);



// profile
router.get('/profile', authMiddleware, ProfileController.index);
router.put('/profile/:id', authMiddleWare, ProfileController.update);


// New routes
router.get('/news', authMiddleware, NewsController.index);
router.post('/news', authMiddleware, NewsController.store);
router.get('/news/:id', authMiddleware, NewsController.show);
router.put('/news/:id', authMiddleware, NewsController.update);
router.delete('/news/:id', authMiddleware, NewsController.destory);

export default router;