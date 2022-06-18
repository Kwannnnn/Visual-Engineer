import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Pipeline } from '../database/models';
import DI from '../DI';
import ValidationError from '../error/ValidationError';
import validate from './validate';

async function isPipelineValid(req: Request, res: Response) {
  return DI
    .itemRepository
    .findOne({ id: req.body.pipeline })
    .then((pipeline) => {
      if (!pipeline) {
        return Promise.reject();
      }

      res.locals.pipeline = pipeline;
      return true;
    });
}

async function areItemsValid(req: Request, res: Response) {
  const firstItem = await DI
    .itemRepository
    .findOne({ id: req.body.firstItem });

  if (!firstItem) {
    return Promise.reject();
  }

  res.locals.firstItem = firstItem;

  const secondItem = await DI
    .itemRepository
    .findOne({ id: req.body.secondItem });

  if (!secondItem) {
    return Promise.reject();
  }

  res.locals.secondItem = secondItem;
  return true;
}

async function isRelationship(res: Response) {
  return DI
    .relationshipRepository
    .findOne({ pipeline: res.locals.pipeline.id })
    .then((relationship) => {
      if (relationship) {
        return Promise.reject();
      }

      return true;
    });
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
      .custom(() => isPipelineValid(req, res))
      .withMessage(new ValidationError('Pipeline not found', 404))
      .custom(() => {
        if (!(res.locals.pipeline instanceof Pipeline)) {
          return Promise.reject();
        }
        return true;
      })
      .withMessage(new ValidationError('The connector must be of type Pipeline.', 400))
      .custom(() => isRelationship(res))
      .withMessage(new ValidationError('Relationship already exists', 400)), // TODO: write test for this
    body('firstItem')
      .exists()
      .withMessage(new ValidationError('Two items are needed to create a relationship.', 400)),
    body('secondItem')
      .exists()
      .withMessage(new ValidationError('Two items are needed to create a relationship.', 400))
      .custom(() => areItemsValid(req, res))
      .withMessage(new ValidationError('Item not found', 404))
      .custom(() => {
        if ((res.locals.firstItem instanceof Pipeline)
        || res.locals.secondItem instanceof Pipeline) {
          return Promise.reject();
        }
        return true;
      })
      .withMessage(new ValidationError('Cannot connect a pipeline to a pipeline', 400))
      .custom(() => {
        if (res.locals.firstItem === res.locals.secondItem) {
          return Promise.reject();
        }
        return true;
      })
      .withMessage(new ValidationError('First and second item cannot be the same', 400)),

  ])(req, res, next);
};

export default relationshipValidator;
