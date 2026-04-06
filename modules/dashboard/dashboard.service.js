import { Errors } from '../../shared/utils/errorTypes.js';
import * as dashboardRepo from './dashboard.repo.js';

export const getDashboardSummary = async (query) => {
  const { from, to } = query;

  if (!from || !to) {
    throw Errors.INVALID_DATE_RANGE();
  }

  if (new Date(from) > new Date(to)) {
    throw Errors.START_DATE_AFTER_END_DATE();
  }

  const data = await dashboardRepo.getSummaryData(query);

  const breakdown = {};

  data.categoryBreakdown.forEach(item => {
  const { category, type, _sum } = item;
  
  if (!breakdown[category]) {
    breakdown[category] = { category, income: 0, expense: 0 };
  }
  
  if (type === 'INCOME') {
    breakdown[category].income = _sum.amount;
  } else if (type === 'EXPENSE') {
    breakdown[category].expense = _sum.amount;
  }
});

  const totalIncome = data.income;
  const totalExpense = data.expense;
  const netBalance = totalIncome - totalExpense;
  const categorySummary = Object.values(breakdown);
  

  return {
    totalIncome,
    totalExpense,
    netBalance,
    categorySummary, // Indicates monthly trend
    recentTransactions: data.recentTransactions
  };
};