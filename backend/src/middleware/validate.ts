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
  // eslint-disable-next-line no-restricted-syntax
  for (const validation of validations) {
    // eslint-disable-next-line no-await-in-loop
    const result: any = await validation.run(req);
    if (result.errors.length) break;
  }

  errorHandler(req, res, next);
};

export default validate;
