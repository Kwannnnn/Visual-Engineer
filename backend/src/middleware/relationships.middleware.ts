import { Request, Response, NextFunction } from 'express';
import { Pipeline } from '../database/models';
import DI from '../DI';

export async function isPipelineValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const pipeline = await DI
    .itemRepository
    .findOne({ tag: req.body!.pipeline });

  if (!pipeline) {
    return res.status(404).json({
      message: 'Pipeline not found',
    });
  }

  req.body.pipeline = pipeline;

  return next();
}

export async function isRelationshipValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { pipelineTag } = req.params;

  const relationship = await DI
    .relationshipRepository
    .findOne(pipelineTag);

  if (!relationship) {
    return res.status(404).json({
      message: 'Relationship not found',
    });
  }

  return next();
}

export function isRequestBodyValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.body || (!req.body.firstItem && !req.body.secondItem && !req.body.pipeline)) {
    return res.status(400).json({
      message: 'Mandatory fields in request body are missing',
    });
  }

  return next();
}

export async function areItemsValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const firstItem = await DI
    .itemRepository
    .findOne({ tag: req.body!.firstItem });

  if (!firstItem) {
    return res.status(404).json({
      message: 'Item not found',
    });
  }

  req.body.firstItem = firstItem;

  const secondItem = await DI
    .itemRepository
    .findOne({ tag: req.body!.secondItem });

  if (!secondItem) {
    return res.status(404).json({
      message: 'Item not found',
    });
  }

  req.body.secondItem = secondItem;

  return next();
}

export function isPipelineInstanceOfPipeline(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!(req.body.pipeline instanceof Pipeline)) {
    return res.status(400).json({
      message: 'The connector must be of type Pipeline.',
    });
  }

  return next();
}

export function areItemsNotInstanceOfPipeline(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body.firstItem instanceof Pipeline || req.body.secondItem instanceof Pipeline) {
    return res.status(400).json({
      message: 'Cannot connect a pipeline to a pipeline',
    });
  }

  return next();
}

export async function areConnectedItemsTheSame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body!.firstItem === req.body!.secondItem) {
    return res.status(400).json({
      message: 'First and second item cannot be the same',
    });
  }

  return next();
}
