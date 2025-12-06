const Joi = require("joi");

// TODO: Add localization key as message?
exports.habitCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  frequencyType: Joi.string().valid("daily", "weekly", "monthly").required(),
  frequencyAmount: Joi.number().min(1).required(),
  dayOfWeek: Joi.number().min(0).max(6),
  dayOfMonth: Joi.number().min(0).max(30),
  timeOfDay: Joi.string(), // How to validate Time datatype in Joi?
}).required();

exports.habitIdSchema = Joi.string().uuid({ version: "uuidv4" }).required();