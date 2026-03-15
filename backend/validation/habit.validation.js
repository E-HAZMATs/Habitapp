const Joi = require("joi");

exports.habitCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'habitNameRequired',
    'string.empty': 'habitNameRequired',
  }),
  description: Joi.string().allow("", null),
  frequencyType: Joi.string().valid("daily", "weekly", "monthly").required().messages({
    'any.required': 'habitFrequencyTypeRequired',
    'any.only': 'habitFrequencyTypeInvalid',
  }),
  frequencyAmount: Joi.number().min(1).required().messages({
    'any.required': 'habitFrequencyAmountRequired',
    'number.min': 'habitFrequencyAmountMin',
    'number.base': 'habitFrequencyAmountRequired',
  }),
  dayOfWeek: Joi.number().min(0).max(6).allow(null).messages({
    'number.min': 'habitDayOfWeekInvalid',
    'number.max': 'habitDayOfWeekInvalid',
  }),
  dayOfMonth: Joi.number().min(1).max(31).allow(null).messages({
    'number.min': 'habitDayOfMonthInvalid',
    'number.max': 'habitDayOfMonthInvalid',
  }),
  timeOfDay: Joi.string().allow(null), // How to validate Time datatype in Joi?
}).required();

exports.habitIdSchema = Joi.string().uuid({ version: "uuidv4" }).required();