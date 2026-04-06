import express from 'express';

import { getSummary } from './dashboard.controller.js';
import { summaryQuerySchema } from './dashboard.validation.js';

import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/summary',
  authenticate,
  validate(summaryQuerySchema),
  asyncHandler(getSummary)
);

export default router;