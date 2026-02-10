const Joi = require('joi');

exports.profileUpdateSchema = Joi.object({
    email: Joi.string().email(),
    timezone: Joi.string(),
  });