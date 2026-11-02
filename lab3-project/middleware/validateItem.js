import HttpError from '../utils/HttpError.js';

export const VALID_STATUSES = ['Playing', 'Completed', 'Wishlist'];

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

const validateItem = (req, res, next) => {
  const body = req.body;

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return next(new HttpError(400, 'Request body must be a JSON object'));
  }

  const { title, platform, status, rating } = body;
  const errors = [];

  if (!isNonEmptyString(title)) {
    errors.push('title must be a non-empty string');
  }
  if (!isNonEmptyString(platform)) {
    errors.push('platform must be a non-empty string');
  }
  if (!VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 0 || rating > 10) {
    errors.push('rating must be a number between 0 and 10');
  }

  if (errors.length > 0) {
    return next(new HttpError(400, 'Validation failed', errors));
  }

  // Pass only clean, trimmed fields to the route handler
  req.validatedItem = {
    title: title.trim(),
    platform: platform.trim(),
    status,
    rating
  };
  next();
};

export default validateItem;
