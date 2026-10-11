const Joi = require('joi');
const { objectId, pagination } = require('./common.validation');

const submit = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().lowercase().email().max(254).required(),
    phone: Joi.string()
      .trim()
      .pattern(/^\+?[0-9\s-]{7,15}$/)
      .messages({ 'string.pattern.base': '"phone" must be a valid phone number' }),
    courseInterest: Joi.string().trim().min(2).max(100).required(),
    message: Joi.string().trim().max(1000).allow(''),
  }),
};

const list = { query: pagination };

const claim = {
  params: Joi.object({ id: objectId.required() }),
};

module.exports = { submit, list, claim };
