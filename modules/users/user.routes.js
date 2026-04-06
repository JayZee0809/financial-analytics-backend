import express from 'express';
import {
  getUsers,
  getUser,
  updateRole,
  getPendingRoleRequests,
  approveRequest,
  rejectRequest
} from './user.controller.js';

import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../shared/middlewares/authorize.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';
import { updateRoleSchema } from './user.validation.js';
import UserRoles from '../../shared/constants/user_roles.constants.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

const router = express.Router();

// ADMIN only
router.get('/', authenticate, authorize([UserRoles.ADMIN]), asyncHandler(getUsers));

// ADMIN only
router.patch(
  '/:id/role',
  authenticate,
  authorize([UserRoles.ADMIN]),
  validate(updateRoleSchema),
  asyncHandler(updateRole)
);

// ADMIN only
router.delete(
  '/:id/role',
  authenticate,
  authorize([UserRoles.ADMIN]),
  asyncHandler(updateRole)
);

// ADMIN ONLY

router.get(
  '/role-requests',
  authenticate,
  authorize([UserRoles.ADMIN]),
  asyncHandler(getPendingRoleRequests)
);

// ADMIN only

router.patch(
  '/:id/approve-role',
  authenticate,
  authorize([UserRoles.ADMIN]),
  asyncHandler(approveRequest)
);

// ADMIN only

router.patch(
  '/:id/reject-role',
  authenticate,
  authorize([UserRoles.ADMIN]),
  asyncHandler(rejectRequest)
);

// ADMIN or self
router.get('/:id', authenticate, asyncHandler(getUser));

export default router;