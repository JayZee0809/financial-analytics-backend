import express from 'express';

import { createRecord, deleteRecord, getRecords, updateRecord } from './financial.controller.js';
import { createRecordSchema, querySchema, updateRecordSchema } from './financial.validation.js';

import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../shared/middlewares/authorize.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import UserRoles from '../../shared/constants/user_roles.constants.js';
import { getCategories } from './financial.service.js';

const router = express.Router();

// ADMIN and ANALYST only
router.get(
  '/',
  authenticate,
  authorize([UserRoles.ADMIN, UserRoles.ANALYST]),
  validate(querySchema),
  asyncHandler(getRecords)
);

// ADMIN only
router.post(
  '/',
  authenticate,
  authorize([UserRoles.ADMIN]),
  validate(createRecordSchema),
  asyncHandler(createRecord)
);

router.get(
  '/categories',
  authenticate,
  authorize([UserRoles.ADMIN]),
  asyncHandler(getCategories)
);

router.patch(
  '/:id',
  authenticate,
  authorize([UserRoles.ADMIN]),
  validate(updateRecordSchema),
  asyncHandler(updateRecord)
);

router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(deleteRecord)
);

export default router;