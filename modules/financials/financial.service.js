import { Errors } from '../../shared/utils/errorTypes.js';
import * as financialRepo from './financial.repo.js';

export const createFinancialRecord = async (user, payload) => {
  return financialRepo.createRecord({
    ...payload,
    createdBy: user.id,
    date: new Date(payload.date).toISOString()
  });
};

export const fetchFinancialRecords = async (query, userRole) => {
  const { ...filters } = query;
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);

  const skip = (page - 1) * limit;
  const take = limit;
  console.log('Fetching records with filters:', filters, 'Pagination:', { page, limit });
  const { data, total } = await financialRepo.getRecords(
    filters,
    { skip, take },
    userRole
  );

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateFinancialRecord = async (id, payload) => {
  const record = await financialRepo.findRecordById(id);

  if (!record) {
    throw Errors.RECORD_NOT_FOUND();
  }

  // Optional: prevent future date
  if (payload.date && new Date(payload.date) > new Date()) {
    throw Errors.FUTURE_DATE_NOT_ALLOWED();
  }

  return financialRepo.updateRecord(id, payload);
};

export const deleteFinancialRecord = async (id) => {
  const record = await financialRepo.findRecordById(id);

  if (!record) {
    throw Errors.RECORD_NOT_FOUND();
  }

  return financialRepo.softDeleteRecord(id);
};

export const getCategories = async () => {
  const categories = await financialRepo.getCategories();
  return categories.map((c) => c.category);
}