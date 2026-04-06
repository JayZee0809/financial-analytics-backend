import bcrypt from 'bcrypt';

import * as authRepo from './auth.repo.js';
import { generateToken } from '../../shared/utils/jwt.js';
import UserRoles from '../../shared/constants/user_roles.constants.js';
import { Errors } from '../../shared/utils/errorTypes.js';

const { ROLE_REQUEST_STATUS } = UserRoles;

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
const simulateDBDelay = (ms) => new Promise(res => setTimeout(res, ms)); // DB connection delay

export const loginUser = async ({ email, password }) => {
  email = email.toLowerCase().trim();
  const user = await authRepo.findUserByEmail(email);

  // Guard against timing attacks
  await simulateDBDelay(300); // Simulating DB connection delay: 300ms (choose based on typical response times)

  if (!user) {
    throw Errors.INVALID_CREDENTIALS();
  }

  // Check if locked
  if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
    throw Errors.ACCOUNT_LOCKED();
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const attempts = user.failedAttempts + 1;

    let updateData = { failedAttempts: attempts };

    // Lock account if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
      updateData.lockUntil = new Date(Date.now() + LOCK_TIME);
      updateData.failedAttempts = 0; // reset after lock
    }

    await authRepo.updateUser(user.id, updateData);

    throw Errors.INVALID_CREDENTIALS();
  }

  // Reset on success
  await authRepo.updateUser(user.id, {
    failedAttempts: 0,
    lockUntil: null
  });

  const token = generateToken({
    id: user.id,
    role: user.role
  });

  return { token };
};

export const registerUser = async (data) => {
  let { name, email, password, role } = data;
  email = email.toLowerCase().trim();

  const existing = await authRepo.findUserByEmail(email);

  if (existing) {
    throw Errors.USER_EXISTS();
  }

  password = password.trim();
  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);

  role = role ? role.toUpperCase() : null;
  const requireRoleApproval = [UserRoles.ADMIN, UserRoles.ANALYST].includes(role);
  const user = await authRepo.createUser({
    name,
    email,
    password: hashedPassword,
    role: UserRoles.VIEWER, // Force default role to VIEWER regardless of input
    requestedRole: requireRoleApproval ? role : null, // Only allow valid requested roles 
    roleRequestStatus: requireRoleApproval ? ROLE_REQUEST_STATUS.PENDING : null
  });

  return user;
};
