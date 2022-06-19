import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import DI from '../DI';
import ValidationError from '../error/ValidationError';
import validate from './validate';

const validators = () => [
  body('name')
    .exists()
    .withMessage(new ValidationError('Board name is missing', 400)),
];

export const postObjectToBoardValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators();
  validatorsArray.push(
    body()
      .custom(() => {
        const id = +req.params.id;
        return DI
          .boardRepository
          .findOne({ id })
          .then((board) => {
            if (!board) {
              return Promise.reject();
            }
            return true;
          });
      })
      .withMessage(new ValidationError('Board not found', 404)),
  );

  validate(validatorsArray)(req, res, next);
};

export const postBoardValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators();
  validate(validatorsArray)(req, res, next);
};
