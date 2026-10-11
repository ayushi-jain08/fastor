const jwt = require('jsonwebtoken');
const config = require('../config');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

async function auth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Missing or invalid Authorization header');
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const employee = await Employee.findById(payload.sub).select('_id name email').lean();
  if (!employee) throw ApiError.unauthorized('Account no longer exists');

  req.employee = employee;
  next();
}

module.exports = auth;
