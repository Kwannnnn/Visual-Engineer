import { Request, Response } from 'express';
import DI from '../../DI';

export const getAllRelationships = async (req: Request, res: Response) => {
  const relationships = await DI.relationshipRepository.findAll();
  res.json(relationships);
};

export const deleteRelationship = async (req: Request, res: Response) => {
  const pipelineTag: string = req.params.tag;

  try {
    const pipeline: any = await DI.itemRepository.find(pipelineTag);

    if (!pipeline) {
      return res.status(404).json({
        message: 'Pipeline not found',
      });
    }

    const relationship = await DI.relationshipRepository.find(pipeline);

    if (!relationship) {
      return res.status(404).json({
        message: 'Relationship not found',
      });
    }

    DI.itemRepository.removeAndFlush(pipeline);
    DI.relationshipRepository.removeAndFlush(relationship);

    return res.status(204).send();
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
