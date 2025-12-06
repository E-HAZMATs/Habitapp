const jwt = require("jsonwebtoken");
const tokenService = require("../services/token.service");
const authService = require("../services/auth.service");
const userService = require('../services/user.service')
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { registerSchema, loginSchema } = require('../validation/auth.validation')


exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const localizationKey = error.details[0].message
    return sendError(res, 400, req.__(localizationKey));
  }

  const emailExists = await userService.isEmailUsed(req.body.email);
  if (!emailExists) {
    return sendError(res, 401, req.__("wrongLoginCreds"));
  }
  const user = await authService.loginUser(req.body);
  if (user) {
    const { accessToken, refreshToken } = tokenService.createTokens(user);
    tokenService.setRtCookie(res, refreshToken);
    return sendSuccess(res, 200, req.__("operationSuccess"), {
      token: accessToken,
    });
  }
  return sendError(res, 401, req.__("wrongLoginCreds"));
};

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const localizationKey = error.details[0].message
    return sendError(res, 400, req.__(localizationKey)); //TODO: Maybe return a list of errors too?
  }
  const emailAlreadyUsed = await userService.isEmailUsed(req.body.email);
  if (emailAlreadyUsed) return sendError(res, 400, req.__("emailUsed"));

  const user = await authService.createUser(req.body);
  if (user) {
    // Should user be returned?
    return sendSuccess(res, 200, undefined, {
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } else {
    return sendError(res, 400, req.__("registerFail"));
  }
};

exports.logout = async (req, res) => {
    res.clearCookie("rt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return sendSuccess(res, 200, req.__("operationSuccess"));
};

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
