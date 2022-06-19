import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import ValidationError from '../error/ValidationError';
import validate from './validate';

const validators = () => [
  body('name')
    .exists()
    .withMessage(new ValidationError('Board name is missing', 400)),
];

const boardValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators();
  validate(validatorsArray)(req, res, next);
};

export default boardValidators;
