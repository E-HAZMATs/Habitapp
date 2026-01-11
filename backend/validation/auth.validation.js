const Joi = require("joi");

// TODO: Add roles to validation?
exports.registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": 'invalidEmail',
    "any.required": 'emailRequired',
  }),
  username: Joi.string().pattern(/^\S{4,15}$/).required().messages({
    "any.required": "usernameRequired",
  }),
  password: Joi.string().min(1).required().messages({    //TODO: change min to suitble limit.
    "any.required": "passwordRequired",
    "string.min": "passwordShort"
  }), 
}).required();

//SO FAR, LOGIN IS VIA EMAIL+PASS ALONE.
exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "invalidEmail",
    "any.required": "emailRequired",
  }),
  password: Joi.string().min(1).required().messages({
    "string.min": "passwordShort",
    "any.required": "passwordRequired",
  }),
}).required();
