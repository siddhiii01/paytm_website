import { onramptx } from '@controllers/onramp.controller.js';
import { AuthMiddleware } from '@middlewares/auth.middleware.js';
import { Router } from 'express';


const router = Router();

//AuthMiddleware.authenticateUser,
router.post('/addtowallet',  onramptx);

export default router;