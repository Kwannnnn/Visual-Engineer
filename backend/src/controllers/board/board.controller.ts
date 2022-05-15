import { Request, Response } from 'express';
import { DI } from '../../index';
import { Item } from '../../database/models';

export const getAll = async (req:Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();

  res.send(boards);
};

export const getById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    try {
        const board = await DI.boardRepository.findOne({ id });

        if (!board) {
            return res.status(404).json({
                message: 'Board not found',
            });
        }

        return res.json(board);
    } catch (e: any) {
        return res.status(400).json({
            message: e.message,
        })
    }
};

export const deleteItemfromBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { string: tag } = req.params;  
  try {
    // find the board
    const board = await DI.boardRepository.findOne({ id: parseInt(id)});
    
    if (!board) {
      return res.status(404).json({
          message: 'Board not found',
      });
    }

    const items = board.items.getItems(); // gets array of all the items
    const item = items.find(Item => Item.tag = tag); // finds an item with the same tag

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }
    
    board.items.remove(item);
    return res.send(item);

  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const { id } =  req.params;

  try{
    // find the board
    const board = await DI.boardRepository.find({ id: parseInt(id) });

    DI.boardRepository.remove({ id });

    return res.send(board);
    
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });    
  }
};
