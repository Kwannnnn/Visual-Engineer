import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import DI from '../DI';
import ValidationError from '../error/ValidationError';
import validate from './validate';

const objectValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    body()
      .custom(async () => {
        const item = await DI.itemRepository.findOne(req.params.id);

        if (item) {
          res.locals.item = item;
          return true;
        }

        return Promise.reject();
      })
      .withMessage(new ValidationError('Item not found', 404)),
  ])(req, res, next);
};

export default objectValidators;
