const habitLogService = require("../services/habitLog.service");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { paginationSchema } = require("../validation/habitLog.validation");

exports.getLogsByUser = async (req, res) => {
  const userId = req.user.id;
  const { error, value } = paginationSchema.validate(req.query);
  if (error) return sendError(res, 400, error.details[0].message);

  const { page, size } = value;
  const result = await habitLogService.getLogsByUser(userId, page, size);
  
  return sendSuccess(res, 200, req.__('operationSuccess'), result);
};