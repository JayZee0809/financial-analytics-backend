import * as dashboardService from './dashboard.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getSummary = async (req, res) => {
  const result = await dashboardService.getDashboardSummary(
    req.query
  );

  return successResponse(res, result, 'Dashboard summary fetched');
};