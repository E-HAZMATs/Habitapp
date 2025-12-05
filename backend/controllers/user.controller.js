const userService = require("../services/user.service");
const Joi = require('joi');
const { sendError, sendSuccess } = require("../utils/responseHandler");
// const roleService = require('../services/role.service')
const userIdSchema = Joi.string().uuid({ version: "uuidv4" }).required();

exports.delete = async (req, res) => {
    const userId = req.params.id;
    const { error } = userIdSchema.validate(userId)
    if(error) return sendError(res, 400, error.details[0].message)
    const user = await userService.findById(req.user.id)
    if (user.id === userId || req.user.role === 'admin'){ // Regular users can only delete themselves. Admin can do delete anyone except himself.
        await userService.deleteById(req.params.id)
        return sendSuccess(res, 200, req.__('operationSuccess'));
    }
    return sendError(res, 401, req.__('cantDeleteOtherUsers'))
}