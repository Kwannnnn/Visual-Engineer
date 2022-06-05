import { Request, Response } from 'express';
import DI from '../../DI';
import { TypedRequest } from '../../routes/util/typed-request';
import { RelationshipParams, RelationshipBody } from '../../routes/relationships/relationships.types';
import { PipeItem } from '../../database/models';

export const getAllRelationships = async (
  req: Request,
  res: Response,
) => {
  const relationships = await DI.relationshipRepository.findAll();
  res.json(relationships);
};

export const getOneRelationship = async (
  req: TypedRequest<RelationshipParams, any>,
  res: Response,
) => {
  const { pipelineTag } = req.params;

  try {
    const relationship = await DI.relationshipRepository.findOne(pipelineTag);

    if (!relationship) {
      return res.status(404).json({
        message: 'Relationship not found',
      });
    }

    return res.json(relationship);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteRelationship = async (
  req: TypedRequest<RelationshipParams, any>,
  res: Response,
) => {
  const { pipelineTag } = req.params;

  try {
    const pipeline: any = await DI.itemRepository.findOne(pipelineTag);
    if (!pipeline) {
      return res.status(404).json({
        message: 'Pipeline not found',
      });
    }

    const relationship = await DI.relationshipRepository.findOne(pipelineTag);
    if (!relationship) {
      return res.status(404).json({
        message: 'Relationship not found',
      });
    }

    await DI.itemRepository.removeAndFlush(pipeline);

    return res.status(204).send();
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const patchRelationship = async (
  req: TypedRequest<RelationshipParams, RelationshipBody>,
  res: Response,
) => {
  const { pipelineTag } = req.params;

  try {
    const relationship = await DI.relationshipRepository.findOne(pipelineTag);

    if (!relationship) {
      return res.status(404).json({
        message: 'Relationship not found',
      });
    }

    if (!req.body || (!req.body.firstItem && !req.body.secondItem && !req.body.pipeline)) {
      return res.status(400).json({
        message: 'Mandatory fields in request body are missing',
      });
    }

    if (!req.body.pipeline || pipelineTag !== req.body.pipeline) {
      return res.status(400).json({
        message: 'Pipeline tag in request body does not match',
      });
    }

    if (req.body.firstItem === req.body.secondItem) {
      return res.status(400).json({
        message: 'First and second item cannot be the same',
      });
    }

    const firstItem = await DI.itemRepository.findOne({ tag: req.body.firstItem });
    const secondItem = await DI.itemRepository.findOne({ tag: req.body.secondItem });
    const pipeline = await DI.itemRepository.findOne({ tag: req.body.pipeline });

    if (secondItem instanceof PipeItem || firstItem instanceof PipeItem) {
      return res.status(400).json({
        message: 'Connected item cannot be a pipe item',
      });
    }

    if (!pipeline) {
      return res.status(404).json({
        message: 'Pipeline not found',
      });
    }

    if ((req.body.firstItem && !firstItem) || (req.body.secondItem && !secondItem)) {
      return res.status(404).json({
        message: 'Item by tag not found',
      });
    }

    relationship.firstItem = firstItem || relationship.firstItem;
    relationship.secondItem = secondItem || relationship.secondItem;

    await DI.relationshipRepository.persistAndFlush(relationship);

    res.status(201);
    return res.json(relationship);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
