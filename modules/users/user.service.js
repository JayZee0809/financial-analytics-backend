import UserRoles from '../../shared/constants/user_roles.constants.js';
import { Errors } from '../../shared/utils/errorTypes.js';
import UserConstants from './user.constants.js';
import * as userRepo from './user.repo.js';

const { ROLE_REQUEST_STATUS } = UserConstants;

export const getAllUsers = async () => {
  return userRepo.findAllUsers();
};

export const getUserById = async (requestingUser, targetUserId) => {
  const user = await userRepo.findUserById(targetUserId);

  if (!user) {
    throw Errors.USER_NOT_FOUND();
  }

  // Allow if ADMIN or self
  if (
    requestingUser.role !== UserRoles.ADMIN &&
    requestingUser.id !== targetUserId
  ) {
    throw Errors.FORBIDDEN();
  }

  return user;
};

export const changeUserRole = async (id, role) => {
  const user = await userRepo.findUserById(id);

  if (!user) {
    throw Errors.USER_NOT_FOUND();
  }

  return userRepo.updateUserRole(id, role);
};

export const getPendingRequests = async () => {
  return userRepo.getPendingRoleRequests();
};

export const approveRoleRequest = async (adminUser, userId) => {
  const user = await userRepo.findUserById(userId);

  if (!user) {
    throw Errors.USER_NOT_FOUND();
  }

  if (user.roleRequestStatus !== ROLE_REQUEST_STATUS.PENDING) {
    throw Errors.NO_PENDING_REQUEST();
  }

  return userRepo.processRoleRequest(userId, {
    role: user.requestedRole,
    requestedRole: null,
    roleRequestStatus: ROLE_REQUEST_STATUS.APPROVED
  });
};

export const rejectRoleRequest = async (userId) => {
  const user = await userRepo.findUserById(userId);

  if (!user) {
    throw Errors.USER_NOT_FOUND();
  }

  if (user.roleRequestStatus !== ROLE_REQUEST_STATUS.PENDING) {
    throw Errors.NO_PENDING_REQUEST();
  }

  return userRepo.processRoleRequest(userId, {
    requestedRole: null,
    roleRequestStatus: ROLE_REQUEST_STATUS.REJECTED
  });
};