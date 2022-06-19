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

const nameMissing = [
  body('name')
    .exists()
    .withMessage(new ValidationError('Board name is missing', 400)),
];

const boardNotFound = (
  req: Request,
  res: Response,
) => [
  body()
    .custom(async () => {
      const id = +req.params.id;
      const board = await DI
        .boardRepository
        .findOne({ id });
      if (!board) {
        return Promise.reject();
      }

      res.locals.board = board;
      return true;
    })
    .withMessage(new ValidationError('Board not found', 404)),
];

export const patchById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    ...nameMissing,
    ...boardNotFound(req, res),
  ])(req, res, next);
};

export const postObjectToBoardValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators();
  validatorsArray.push(
    body()
      .custom(async () => {
        const id = +req.params.id;
        const board = await DI
          .boardRepository
          .findOne({ id });
        if (!board) {
          return Promise.reject();
        }
        return true;
      })
      .withMessage(new ValidationError('Board not found', 404)),
  );

  validate(validatorsArray)(req, res, next);
};

export const patchBoardValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators();
  validatorsArray.push(
    body()
      .custom(async () => {
        const id = +req.params.id;
        const board = await DI
          .boardRepository
          .findOne({ id });
        if (!board) {
          return Promise.reject();
        }
        return true;
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
