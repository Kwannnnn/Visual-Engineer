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
        return true;
      }

      return false;
    });
}

const validators = (
  req: Request,
  res: Response,
) => [
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
    .withMessage(new ValidationError('The connector must be of type Pipeline.', 400)),
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
];

export const postValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators(req, res);
  validatorsArray.push(
    body()
      .custom(async () => {
        if (await isRelationship(res)) {
          return Promise.reject();
        }

        return true;
      })
      .withMessage(new ValidationError('Relationship already exists', 400)),
  );

  validate(validatorsArray)(req, res, next);
};

export const patchValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validatorsArray = validators(req, res);
  validatorsArray.push(
    body()
      .custom(async () => {
        if (await isRelationship(res)) {
          return true;
        }

        return Promise.reject();
      })
      .withMessage(new ValidationError('Relationship not found', 404)),
  );

  validate(validatorsArray)(req, res, next);
};

export const deleteValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    body()
      .custom(() => DI
        .itemRepository
        .findOne({ id: req.params.pipelineId })
        .then((pipeline) => {
          if (!pipeline) {
            return Promise.reject();
          }

          res.locals.pipeline = pipeline;
          return true;
        }))
      .withMessage(new ValidationError('Pipeline not found', 404))
      .custom(async () => {
        if (await isRelationship(res)) {
          return true;
        }

        return Promise.reject();
      })
      .withMessage(new ValidationError('Relationship not found', 404)),
  ])(req, res, next);
};

export const getValidators = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  validate([
    body()
      .custom(() => DI
        .relationshipRepository
        .findOne({ pipeline: req.params.pipelineId })
        .then((relationship) => {
          if (relationship) {
            res.locals.relationship = relationship;
            return true;
          }

          return Promise.reject();
        }))
      .withMessage(new ValidationError('Relationship not found', 404)),
  ])(req, res, next);
};
