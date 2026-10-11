const jwt = require('jsonwebtoken');
const config = require('../config');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

const signToken = (employeeId) =>
  jwt.sign({ sub: employeeId.toString() }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const buildSession = (employee) => ({ token: signToken(employee._id), employee: employee.toProfile() });

async function register({ name, email, password }) {
  if (await Employee.exists({ email })) throw ApiError.conflict('Email already registered');
  const employee = await Employee.create({ name, email, password });
  return buildSession(employee);
}

async function login({ email, password }) {
  const employee = await Employee.findOne({ email }).select('+password');
  if (!employee || !(await employee.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  return buildSession(employee);
}

module.exports = { register, login };
