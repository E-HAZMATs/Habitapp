class ApiResponse {
  constructor(success, message, data = null, errors = null) {
    this.success = success;
    this.message = message;
    if (data !== null) this.data = data;
    if (errors !== null) this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

exports.sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json(
    new ApiResponse(true, message, data)
  );
};

exports.sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  return res.status(statusCode).json(
    new ApiResponse(false, message, null, errors)
  );
};

exports.errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    console.error('==== ERROR MIDDLEWARE REACHED ====')
    console.error('*** ERROR ***');
    console.error(err);
    console.error('************');
  } else {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  if (err.isOperational) {
    console.log('hiiii')
    return exports.sendError(res, err.statusCode, err.message);
  }

  if (isDevelopment) {
    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()   
    });
  }
  
  return exports.sendError(res, 500, req.__('InternalServerError'));
};

// Wrapper for catching unexpected errors.
// No need to try/catch in controller, just wrap controller method with this.
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(error => next(error));
  };
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

exports.AppError = AppError;

