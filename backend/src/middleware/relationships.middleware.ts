import { Request, Response, NextFunction } from 'express';
import { Pipeline } from '../database/models';
import DI from '../DI';

export async function isValidPipeline(
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

export async function areValidItems(
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
      message: 'First and second item cannot be the same.',
    });
  }

  return next();
}
