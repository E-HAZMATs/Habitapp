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

exports.changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'passwordRequired',
        'any.required': 'passwordRequired',
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.empty': 'passwordRequired',
        'string.min': 'passwordShort',
        'any.required': 'passwordRequired',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'passwordMismatch',
        'any.required': 'passwordRequired',
    }),
});