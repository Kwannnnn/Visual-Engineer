import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Express validator handler to validate query and body parameters for each endpoint
 */
const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req).array({ onlyFirstError: true })[0];
  if (!error) {
    return next();
  }

  return res.status(error.msg.statusCode).json(error.msg.message);
};

const validate = (
  validations: ValidationChain[],
) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  errorHandler(req, res, next);
};

export default validate;
