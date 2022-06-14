import { Request, Response } from 'express';
import DI from '../../DI';
import { TypedRequest } from '../../routes/util/typed-request';
import { Relationship } from '../../database/models';
import ValidationError from '../../error/ValidationError';
import { RelationshipParams, RelationshipRequestBody } from '../../routes/relationships/relationships.types';
import { pipeline } from 'stream';

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
  const { pipelineId } = req.params;

  try {
    const relationship = await DI.relationshipRepository.findOne(pipelineId);

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
  req: TypedRequest<any, RelationshipRequestBody>,
  res: Response,
) => {
  try {
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

export const patchRelationship = async (
  req: TypedRequest<any, RelationshipRequestBody>,
  res: Response,
) => {
  const { pipelineId } = req.params;

  try {
    const relationship = await DI.relationshipRepository.findOne(pipelineId);

    const firstItem = req.body!.firstItem!;
    const secondItem = req.body!.secondItem!;

    relationship!.firstItem = firstItem;
    relationship!.secondItem = secondItem;

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

export const deleteRelationship = async (
  req: TypedRequest<RelationshipParams, any>,
  res: Response,
) => {
  const { pipelineId } = req.params;

  try {
    const pipeline: any = await DI.itemRepository.findOne(pipelineId);
    if (!pipeline) {
      return res.status(404).json({
        message: 'Pipeline not found',
      });
    }

    const relationship = await DI.relationshipRepository.findOne(pipelineId);
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
