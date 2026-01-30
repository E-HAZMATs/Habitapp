const jwt = require("jsonwebtoken");

exports.createJwt = (user) => {
  return jwt.sign({ id: user.id, email: user.email, roleId: user.Role.id, role: user.Role.name, timezone: user.timezone }, process.env.JWT_KEY, {
    expiresIn: "15m",
  });
};

exports.createRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.RT_KEY, { expiresIn: "7d" });
};

exports.createTokens = (user) => {
  const accessToken = this.createJwt(user);
  const refreshToken = this.createRefreshToken(user);
  return { accessToken, refreshToken };
};

exports.setRtCookie = (res, refreshToken) => {
  res.cookie("rt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //maybe set false for now since i'm not using https?
    sameSite: "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
