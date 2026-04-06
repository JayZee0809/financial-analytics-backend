import Joi from 'joi';

export const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('INCOME', 'EXPENSE').required(),
  category: Joi.string().max(50).required(),
  date: Joi.date().required(),
  notes: Joi.string().max(255).allow('', null)
});

export const querySchema = Joi.object({
  type: Joi.string().valid('INCOME', 'EXPENSE'),
  category: Joi.string().max(50),
  from: Joi.date(),
  to: Joi.date(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10)
});

export const updateRecordSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid('INCOME', 'EXPENSE'),
  category: Joi.string().max(50),
  date: Joi.date(),
  notes: Joi.string().max(255).allow('', null)
});