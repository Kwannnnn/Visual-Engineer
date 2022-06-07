import { Request, Response } from 'express';
import DI from '../../DI';
import { TypedRequest } from '../../routes/util/typed-request';
import * as utils from './relationship.util';
import { Relationship } from '../../database/models';
import ValidationError from '../../error/ValidationError';
import { RelationshipParams, RelationshipBody } from '../../routes/relationships/relationships.types';

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

export const postRelationship = async (
  req: TypedRequest<any, RelationshipBody>,
  res: Response,
) => {
  try {
    utils.validateRequest(req.body);

    const pipeline = await DI.itemRepository.findOne({ tag: req.body!.pipeline });
    const firstItem = await DI.itemRepository.findOne({ tag: req.body!.firstItem });
    const secondItem = await DI.itemRepository.findOne({ tag: req.body!.secondItem });

    utils.validateItems(pipeline, firstItem, secondItem);
    utils.checkItemsRelationship(firstItem, secondItem);

    const relationship: Relationship = DI.em.create(Relationship, req.body!);
    await DI.relationshipRepository.persist(relationship).flush();

    return res.status(201).json(relationship);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      return res.status(e.statusCode).json({
        message: e.message,
      });
    }
    return res.status(500).json({
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

    utils.validateRelationshipPatchBody(req, relationship, pipelineTag);

    const firstItem = await DI.itemRepository.findOne({ tag: req.body!.firstItem });
    const secondItem = await DI.itemRepository.findOne({ tag: req.body!.secondItem });
    const pipeline = await DI.itemRepository.findOne({ tag: req.body!.pipeline });

    utils.validateRelationshipItems(req, firstItem, secondItem, pipeline);

    relationship!.firstItem = firstItem || relationship!.firstItem;
    relationship!.secondItem = secondItem || relationship!.secondItem;

    await DI.relationshipRepository.persistAndFlush(relationship!);

    res.status(201);
    return res.json(relationship);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      return res.status(e.statusCode).json({
        message: e.message,
      });
    }
    return res.status(400).json({
      message: e.message,
    });
  }
};
