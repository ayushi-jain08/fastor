const ApiError = require('../utils/ApiError');

const SOURCES = ['params', 'query', 'body'];


const validate = (schemas) => (req, res, next) => {
  const errors = [];

  for (const source of SOURCES) {
    if (!schemas[source]) continue;

    const { value, error } = schemas[source].validate(req[source] ?? {}, {
      abortEarly: false,
      stripUnknown: true,
      errors: { wrap: { label: '' } },
    });

    if (error) {
      errors.push(...error.details.map((d) => ({ field: d.path.join('.'), message: d.message })));
      continue;
    }

    // Express 5 exposes req.query as a getter, so redefine instead of assigning.
    Object.defineProperty(req, source, { value, writable: true, configurable: true, enumerable: true });
  }

  if (errors.length) return next(ApiError.badRequest('Validation failed', errors));
  next();
};

module.exports = validate;
