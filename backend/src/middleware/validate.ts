import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Express validator handler to validate query and body parameters for each endpoint
 */
const validate = (
  validations: ValidationChain[],
) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

export default validate;
