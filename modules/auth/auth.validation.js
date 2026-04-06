import Joi from 'joi';
import UserRoles from '../../shared/constants/user_roles.constants.js';

const passwordSchema = Joi.string()
  .min(8)
  .max(64)
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[0-9]/, 'numeric')
  .messages({
    'string.pattern.name':
      'Password must include at least one {#name} character',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 64 characters'
  });

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: passwordSchema.required(),
  role: Joi.string().valid(UserRoles.ADMIN, UserRoles.ANALYST, UserRoles.VIEWER).optional() // Allow role in registration but will be overridden to VIEWER by service
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});