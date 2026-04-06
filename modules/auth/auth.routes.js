import express from 'express';

import { register, login } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { authLimiter } from './auth.limiter.js';

import { validate } from '../../shared/middlewares/validation.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

const router = express.Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login));

export default router;