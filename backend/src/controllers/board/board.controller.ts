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
    // find the board
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    const items = board.items.getItems(); // gets array of all the items
    const item = items.find((Item) => Item.tag === tag); // finds an item with the same tag

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    board.items.remove(item);

    res.status(204);
    return res.send(`Deleted item ${item.name} from board ${
      board.name} and ID ${board.id}`);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const id: number = +req.params.id;

  try {
    // find the board
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    DI.boardRepository.removeAndFlush(board);

    res.status(204);
    return res.send(`Deleted board ${board.name} with ID ${board.id}`);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
