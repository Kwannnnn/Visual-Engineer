import { Request, Response } from 'express';
import DI from '../../DI';

export const getAll = async (req: Request, res: Response) => {
  const items = await DI.itemRepository.findAll();
  res.send(items);
};

export const getByTag = async (req: Request, res: Response) => {
  const { tag } = req.params;

  try {
    const item = await DI.itemRepository.findOne({ tag });

    if (item === undefined) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    return res.json(item);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
