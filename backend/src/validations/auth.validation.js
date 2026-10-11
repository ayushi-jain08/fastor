const Joi = require('joi');

const email = Joi.string().trim().lowercase().email().max(254).required();

const register = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email,
    password: Joi.string().min(6).max(128).required(),
  }),
};

const login = {
  body: Joi.object({
    email,
    password: Joi.string().required(),
  }),
};

module.exports = { register, login };
