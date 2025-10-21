const logger = require('../utils/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validación fallida:', { errors, body: req.body });

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    req.validatedData = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validación de query fallida:', { errors, query: req.query });

      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros de consulta',
        errors
      });
    }

    req.validatedQuery = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery
};
