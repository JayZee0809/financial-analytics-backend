import UserRoles from '../../shared/constants/user_roles.constants.js';
import { successResponse } from '../../shared/utils/response.js';
import * as authService from './auth.service.js';

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  const data = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const message = [UserRoles.ADMIN, UserRoles.ANALYST]
    .includes(req.body.role) ? 
      'User registered successfully. Role elevation under review.' :
      'User registered successfully';

  return successResponse(res, data, message);
};

export const login = async (req, res) => {
    const result = await authService.loginUser(req.body);

    return successResponse(res, result, 'Login successful');
};