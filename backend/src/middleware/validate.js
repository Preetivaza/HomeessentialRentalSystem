import { ErrorResponse } from './errorHandler.js';

const validate = (schema) => {
  return (req, res, next) => {
    // Back-compat: validate(fn) assumes body validator.
    // New: validate({ body, query, params }) validates each segment if provided.
    const bodyValidator = typeof schema === 'function' ? schema : schema?.body;
    const queryValidator = typeof schema === 'object' ? schema?.query : undefined;
    const paramsValidator = typeof schema === 'object' ? schema?.params : undefined;

    const results = [
      bodyValidator ? bodyValidator(req.body) : null,
      queryValidator ? queryValidator(req.query) : null,
      paramsValidator ? paramsValidator(req.params) : null,
    ].filter(Boolean);

    const firstError = results.find(r => r?.error)?.error;
    
    if (firstError) {
      const message = firstError.details
        ? firstError.details.map(detail => detail.message).join(', ')
        : firstError;
      return next(new ErrorResponse(message, 400));
    }
    
    next();
  };
};

export default validate;
