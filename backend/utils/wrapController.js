const { asyncHandler } = require('./responseHandler')

// Func to wrap controllers with the async handler. Reduce repetitve code.
exports.wrapController = (controller) => {
  const wrapped = {};

  for (const key in controller) {
    if (typeof controller[key] === "function") {
      wrapped[key] = asyncHandler(controller[key]);
    } else {
      wrapped[key] = controller[key];
    }
  }
  return wrapped;
};
