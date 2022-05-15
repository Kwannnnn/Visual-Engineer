import { Request, Response } from 'express';
import DI from '../../index';

export const getAll = async (req: Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();
  res.send(boards);
};

export const getById = async (req: Request, res: Response) => {
  const id: number = +req.params.id;

  try {
      const board = await DI.boardRepository.findOne(id);

      if (!board) {
          return res.status(404).json({
              message: 'Board not found',
          });
      }

      return res.json(board);
  } catch (e: any) {
      return res.status(400).json({
          message: e.message,
      });
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

    const item = board.items[1]; // change with actual index of theitem to remove

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }
    
    board.items.remove(item);

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
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });    
  }
};
