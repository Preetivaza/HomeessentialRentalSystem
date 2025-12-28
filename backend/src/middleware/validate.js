import { ErrorResponse } from './errorHandler.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);
    
    if (error) {
      const message = error.details ? error.details.map(detail => detail.message).join(', ') : error;
      return next(new ErrorResponse(message, 400));
    }
    
    next();
  };
};

export default validate;
