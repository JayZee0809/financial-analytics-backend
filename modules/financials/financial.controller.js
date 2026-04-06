import { successResponse } from '../../shared/utils/response.js';
import * as financialService from './financial.service.js';

export const createRecord = async (req, res) => {
  const record = await financialService.createFinancialRecord(
    req.user,
    req.body
  );

  const data = {
    record
  };

  return successResponse(res, data, 'Record created successfully');
};

export const getRecords = async (req, res) => {
  const result = await financialService.fetchFinancialRecords(
    req.query,
    req.user.role
  );

  return successResponse(res, result, 'Records fetched successfully');
};

export const updateRecord = async (req, res) => {
  const result = await financialService.updateFinancialRecord(
    req.params.id,
    req.body
  );

  return successResponse(res, result, 'Record updated successfully');
};

export const deleteRecord = async (req, res) => {
  await financialService.deleteFinancialRecord(req.params.id);

  return successResponse(res, null, 'Record deleted successfully');
};