const jwt = require("jsonwebtoken");
const tokenService = require("../services/token.service");
const userService = require("../services/user.service");
const { sendError, sendSuccess } = require("../utils/responseHandler");

exports.refresh = async (req, res) => {
  const RT = req.cookies.rt;
  if (!RT) return sendError(res, 401, req.__("noRefreshToken"));
  
  const decodedRT = jwt.verify(RT, process.env.RT_KEY);
  let user = null;
  user = await userService.findById(decodedRT.id);
  const { accessToken, refreshToken } = tokenService.createTokens(user);
  tokenService.setRtCookie(res, refreshToken);
  return sendSuccess(res, 200, undefined, {
    token: accessToken,
  });
};
