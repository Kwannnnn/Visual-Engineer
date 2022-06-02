import { Request, Response } from 'express';
import DI from '../../DI';

export const getAllRelationships = async (req: Request, res: Response) => {
  const relationships = await DI.relationshipRepository.findAll();
  console.log(relationships.length);
  res.json(relationships);
};

export const getOneRelationship = async (req: Request, res: Response) => {
  const { pipelineTag } = req.params;

  try {
    const relationship = await DI.relationshipRepository.find(pipelineTag);
    console.log(relationship);

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

export const deleteRelationship = async (req: Request, res: Response) => {
  const { pipelineTag } = req.params;
  console.log(pipelineTag);

  try {
    const pipeline: any = await DI.itemRepository.find(pipelineTag);
    console.log(pipeline);
    if (!pipeline) {
      return res.status(404).json({
        message: 'Pipeline not found',
      });
    }

    const relationship = await DI.relationshipRepository.find(pipelineTag);
    console.log(relationship);
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
