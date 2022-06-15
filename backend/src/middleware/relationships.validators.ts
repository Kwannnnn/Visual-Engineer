import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import validate from './validate';
import { Pipeline } from '../database/models';
import DI from '../DI';
import ValidationError from '../error/ValidationError';

async function isPipelineValid(req: Request) {
  return DI
    .itemRepository
    .findOne({ id: req.body.pipeline })
    .then((pipeline) => {
      if (!pipeline) {
        return false;
      }

      req.body.pipeline = pipeline;
      return true;
    });
}

async function areItemsValid(req: Request) {
  const firstItem = await DI
    .itemRepository
    .findOne({ id: req.body!.firstItem });

  if (!firstItem) {
    return false;
  }

  req.body.firstItem = firstItem;

  const secondItem = await DI
    .itemRepository
    .findOne({ id: req.body!.secondItem });

  if (!secondItem) {
    return false;
  }

  req.body.secondItem = secondItem;
  return true;
}

const relationshipValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    body('pipeline')
      .exists()
      .withMessage(new ValidationError('Pipeline is missing', 400))
      .bail()
      .custom(() => isPipelineValid(req))
      .withMessage(new ValidationError('Pipeline not found', 404))
      .bail()
      .custom(() => req.body.pipeline instanceof Pipeline)
      .withMessage(new ValidationError('The connector must be of type Pipeline.', 400))
      .bail(),
    body(['firstItem', 'secondItem'])
      .exists()
      .withMessage(new ValidationError('Two items are needed to create a relationship.', 400))
      .bail()
      .custom(() => areItemsValid(req))
      .withMessage(new ValidationError('Item not found', 404))
      .bail()
      .custom(() => !(req.body.firstItem instanceof Pipeline)
      || !(req.body.secondItem instanceof Pipeline))
      .withMessage(new ValidationError('Cannot connect a pipeline to a pipeline', 400))
      .custom(() => req.body.firstItem !== req.body.secondItem)
      .withMessage(new ValidationError('First and second item cannot be the same', 400)),

  ])(req, res, next);
};

export default relationshipValidator;
