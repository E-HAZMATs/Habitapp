const Joi = require('joi');

// APPLY SAME VALIDATION AS REGISTER.
exports.profileUpdateSchema = Joi.object({
    username: Joi.string().pattern(/^\S{4,15}$/).optional().messages({
        "string.pattern.base": "userNameValidationMsg"
    }),
    email: Joi.string().email().optional().messages({
        "string.email": 'invalidEmail',
    }),
    timezone: Joi.string().optional()
}).min(1);