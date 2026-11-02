import HttpError from '../utils/HttpError.js';

// Catches any request that did not match a route -> 404
export const notFoundHandler = (req, res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

// Four-parameter signature marks this as error-handling middleware
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let message = err.message;

  // Malformed JSON thrown by express.json()
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON in request body';
  }

  // Never leak internal details for unexpected errors
  if (status >= 500) {
    console.error(err);
    status = 500;
    message = 'Internal Server Error';
  }

  const body = { error: { status, message } };
  if (err.details) {
    body.error.details = err.details;
  }

  res.status(status).json(body);
};
