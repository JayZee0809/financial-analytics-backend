import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // max login attempts per IP
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  }
});