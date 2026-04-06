import UserRole from '../../shared/constants/user_roles.constants.js';
import prisma from '../../shared/db/prisma.js';

export const createRecord = async (data) => {
  return prisma.financialRecord.create({
    data
  });
};

export const getRecords = async (filters, pagination, userRole) => {
  const { type, category, from, to } = filters;
  const { skip, take } = pagination;

  const where = {
    ...(type && { type }),
    ...(category && { category }),
    ...(from || to
      ? {
          date: {
            ...(from && { gte: new Date(from).toISOString() }),
            ...(to && { lte: new Date(to).toISOString() })
          }
        }
      : {}),
    isDeleted: [UserRole.ADMIN].includes(userRole) ? undefined : false
  };

  const [data, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take
    }),
    prisma.financialRecord.count({ where })
  ]);

  return { data, total };
};

export const findRecordById = async (id) => {
  return prisma.financialRecord.findFirst({
    where: { id, isDeleted: false }
  });
};

export const updateRecord = async (id, data) => {
  return prisma.financialRecord.update({
    where: { id },
    data
  });
};

export const softDeleteRecord = async (id) => {
  return prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true }
  });
};

export const getCategories = async () => {
  const categories = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    select: { category: true },
    distinct: ['category']
  });

  return categories.map((c) => c.category);
};