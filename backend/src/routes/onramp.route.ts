import { onramptx } from '@controllers/onramp.controller.js';
import { AuthMiddleware } from '@middlewares/auth.middleware.js';
import { Router } from 'express';


const onrampRoute = Router();

//AuthMiddleware.authenticateUser,
onrampRoute.post('/addtowallet',  onramptx);

export default onrampRoute;