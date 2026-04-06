import prisma from '../../shared/db/prisma.js';
import UserConstants from './user.constants.js';

const { ROLE_REQUEST_STATUS } = UserConstants;

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const updateUserRole = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role }
  });
};

export const getPendingRoleRequests = async () => {
  return prisma.user.findMany({
    where: {
      roleRequestStatus: ROLE_REQUEST_STATUS.PENDING
    },
    select: {
      id: true,
      name: true,
      email: true,
      requestedRole: true,
      roleRequestStatus: true,
      createdAt: true
    }
  });
};

export const processRoleRequest = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};