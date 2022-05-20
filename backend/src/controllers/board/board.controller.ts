import { Request, Response } from 'express';
import DI from '../../DI';

export const getAll = async (req: Request, res: Response) => {
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
    });
  }
};

export const getBoardObjects = async (req: Request, res: Response) => {
  const id: number = +req.params.id;

  try {
    const board = await DI.boardRepository.findOne({ id });

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    await board.items.init();
    const items = board.items.getItems();
    DI.boardRepository.persistAndFlush(board);

    return res.json(items);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteObjectFromBoard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const { tag } = req.params;

  try {
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    await board.items.init();

    const items = board.items.getItems();
    const item = items.find((Item) => Item.tag === tag);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    DI.itemRepository.removeAndFlush(item);
    board.items.remove(item);

    return res.status(204).json({
      message: 'Item deleted',
    });
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;

  try {
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    await board.items.init();

    const items = board.items.getItems();
    DI.itemRepository.removeAndFlush(items);
    DI.boardRepository.removeAndFlush(board);

    return res.status(204).json({
      message: 'Board deleted',
    });
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
