import Joi from 'joi';

export const summaryQuerySchema = Joi.object({
  from: Joi.date(),
  to: Joi.date()
});