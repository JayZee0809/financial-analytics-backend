import prisma from '../../shared/db/prisma.js';

export const getSummaryData = async (filters) => {
  const { from, to } = filters;

  const where = {
    ...(from || to
      ? {
          date: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) })
          }
        }
      : {}),
    isDeleted: false
  };

  // Parallel queries for performance
  const [
    incomeAgg,
    expenseAgg,
    categoryBreakdown,
    recentTransactions
  ] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true }
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true }
    }),
    prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where,
      _sum: { amount: true }
    }),
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 5
    })
  ]);

  return {
    income: incomeAgg._sum.amount || 0,
    expense: expenseAgg._sum.amount || 0,
    categoryBreakdown,
    recentTransactions
  };
};