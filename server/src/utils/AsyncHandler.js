/**
 * AsyncHandler wrapper to catch async errors and pass them to Express error handler
 * Eliminates the need for try-catch blocks in async controllers
 * 
 * @param {Function} requestHandler - The async route controller
 * @returns {Function} Express middleware function
 */
const AsyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default AsyncHandler;
