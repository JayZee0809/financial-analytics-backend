import prisma from '../../shared/db/prisma.js';

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data
  });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};