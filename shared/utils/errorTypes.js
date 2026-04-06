import { AppError } from "./AppError.js";

export const Errors = {
  USER_NOT_FOUND: () => new AppError('User not found', 404),
  INVALID_CREDENTIALS: () => new AppError('Invalid credentials', 401),
  FORBIDDEN: () => new AppError('Forbidden', 403),
  USER_EXISTS: () => new AppError('User already exists', 409),
  NO_PENDING_REQUEST: () => new AppError('No pending request for this user', 400),
  ACCOUNT_LOCKED: () => new AppError('Account is temporarily locked. Try later.', 403),
  INVALID_DATE_RANGE: () => new AppError('Invalid date range', 400),
  START_DATE_AFTER_END_DATE: () => new AppError('Start Date must be before End Date', 400),
  FUTURE_DATE_NOT_ALLOWED: () => new AppError('Future date not allowed', 400),
  RECORD_NOT_FOUND: () => new AppError('Record not found', 404)
};
