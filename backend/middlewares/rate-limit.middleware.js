const rateLimit = require('express-rate-limit');

exports.authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => ({
    success: false,
    message: req.__('tooManyReqs'),
    timestamp: new Date().toISOString()
  })
});
