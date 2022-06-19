import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import DI from '../DI';
import ValidationError from '../error/ValidationError';
import validate from './validate';

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
        .findOne({ id }, { populate: ['items'] });
      if (!board) {
        return Promise.reject();
      }

      res.locals.board = board;
      return true;
    })
    .withMessage(new ValidationError('Board not found', 404)),
];

const objectNotFound = (
  req: Request,
  res: Response,
) => [
  body()
    .custom(async () => {
      const { objectId } = req.params;
      const item = await DI.itemRepository.findOne(objectId);
      const { items } = res.locals.board;

      if (!item || !items.contains(item)) {
        return Promise.reject();
      }

      res.locals.item = item;
      return true;
    })
    .withMessage(new ValidationError('Object not found', 404)),
];

export const validateRequestBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    ...nameMissing,
    ...boardNotFound(req, res),
  ])(req, res, next);
};

export const patchBoardObjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    ...boardNotFound(req, res),
    ...objectNotFound(req, res),
  ])(req, res, next);
};

export const postBoard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    ...nameMissing,
  ])(req, res, next);
};

export const isBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    ...boardNotFound(req, res),
  ])(req, res, next);
};
