const mongoose = require('mongoose');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const Res = require('../utils/Res');
const { StatusCodes } = require('../utils/statusCodes');

const notFound = (req, res) => Res.error(res, StatusCodes.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`);

// Translate known library errors into ApiErrors so the handler has one rendering path.
function normalize(err) {
  if (err instanceof ApiError) return err;
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiError.badRequest('Validation failed', errors);
  }
  if (err instanceof mongoose.Error.CastError) return ApiError.badRequest(`Invalid ${err.path}`);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'value';
    return ApiError.conflict(`${field} already exists`);
  }
  if (err.type === 'entity.parse.failed') return ApiError.badRequest('Malformed JSON body');
  return null;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const apiError = normalize(err);
  if (apiError) return Res.error(res, apiError.status, apiError.message, apiError.errors);

  console.error(err);
  const message = config.env === 'production' ? 'Internal server error' : err.message;
  return Res.error(res, StatusCodes.INTERNAL_SERVER_ERROR, message);
}

module.exports = { notFound, errorHandler };
