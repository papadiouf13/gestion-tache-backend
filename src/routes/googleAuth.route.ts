import { Router } from 'express';
import { GoogleAuthController } from '../controllers/GoogleAuthController';

const router = Router();
const googleAuthController = new GoogleAuthController();

router.post('/google', googleAuthController.loginWithGoogle);

export default router;
