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

    if (!item) {
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

// api/v1/boards/{id}/items/{tag}
export const deleteItem = async (req: Request, res: Response) => {
  const { string: id } = req.params;

  try{
    // find the board
    const board = await DI.itemRepository.findAll; // idk how to find a board yet

  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }

  const { string: tag } = req.params;

  try {
    // find the item
    const item = await DI.itemRepository.find({ tag }); //substitute DI.itemRepository with board
    
    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }
    // if item is not null - delete
    DI.itemRepository.remove(item); // remove from board not db

  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

// api/v1/boards/{id}
export const deleteBoard = async (req: Request, res: Response) => {
  // get all the items on the board
  // delete each item located on the board

  const { string: id } = req.params;

  try{
    // find the board
    const board = await DI.itemRepository.findAll; // idk how to find a board yet


    DI.itemRepository.remove(board);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });    
  }

};
