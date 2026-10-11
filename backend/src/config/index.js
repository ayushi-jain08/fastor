require('dotenv').config({ quiet: true });
const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
}).unknown();

const { value: env, error } = envSchema.validate(process.env, { abortEarly: false });
if (error) {
  throw new Error(`Invalid environment config: ${error.details.map((d) => d.message).join(', ')}`);
}

module.exports = Object.freeze({
  env: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  jwt: { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN },
});
