const authService = require('../services/auth.service');
const Res = require('../utils/Res');

exports.register = async (req, res) => {
  const session = await authService.register(req.body);
  return Res.created(res, session, 'Registered successfully');
};

exports.login = async (req, res) => {
  const session = await authService.login(req.body);
  return Res.success(res, session, 'Logged in successfully');
};
