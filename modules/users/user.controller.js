import { successResponse } from '../../shared/utils/response.js';
import * as userService from './user.service.js';

export const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();

  return successResponse(res, users, 'Users fetched successfully');
};

export const getUser = async (req, res) => {
  const user = await userService.getUserById(
    req.user,
    req.params.id
  );

  return successResponse(res, user, 'User fetched successfully');
};

export const updateRole = async (req, res) => {
    const updated = await userService.changeUserRole(
      req.params.id,
      req.body.role
    );

    const data = {
      id: updated.id,
      role: updated.role
    };

    return successResponse(res, data, 'User role updated');
};

export const getPendingRoleRequests = async (req, res) => {
  const data = await userService.getPendingRequests();

  return successResponse(res, data, 'Pending role requests fetched');
};

export const approveRequest = async (req, res) => {
  const result = await userService.approveRoleRequest(
    req.user,
    req.params.id
  );

  return successResponse(res, result, 'Role request approved');
};

export const rejectRequest = async (req, res) => {
  const result = await userService.rejectRoleRequest(
    req.params.id
  );

  return successResponse(res, result, 'Role request rejected');
};