import { Router } from "express";
import * as authControllers from '../controllers/auth.js';
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { authRegisterSchema, authLoginSchema, requestResetEmailSchema, resetPasswordSchema, authOAuthGoogleSchema } from "../validation/auth.js";

const authRouter = Router();

authRouter.post('/register',validateBody(authRegisterSchema),ctrlWrapper(authControllers.registerController));

authRouter.post('/login', validateBody(authLoginSchema),ctrlWrapper(authControllers.loginController));

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshSessionController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.post('/send-reset-email',validateBody(requestResetEmailSchema),ctrlWrapper(authControllers.requestResetEmailController));

authRouter.post('/reset-pwd',validateBody(resetPasswordSchema),ctrlWrapper(authControllers.resetPasswordController));

authRouter.get('/get-oauth-url',ctrlWrapper(authControllers.getGoogleoAuthUrlController));

authRouter.post('/confirm-oauth', validateBody(authOAuthGoogleSchema),ctrlWrapper(authControllers.loginWithGoogleController));

export default authRouter;
