import { Request, Response } from 'express';
import DI from '../../DI';
import { BoardParams, PatchBoardBody } from '../../routes/boards/boards.types';
import { TypedRequest } from '../../routes/util/typed-request';

export const getAll = async (req: Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();

  return res.send(boards);
};

export const getById = async (req: TypedRequest<BoardParams, any>, res: Response) => {
  const { id } = req.params;

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

export const getBoardObjects = async (req: TypedRequest<BoardParams, any>, res: Response) => {
  const { id } = req.params;

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

export const patchById = async (req: TypedRequest<BoardParams, PatchBoardBody>, res: Response) => {
  const { id } = req.params;

  try {
    const board = await DI.boardRepository.findOne({ id });

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    if (req.body?.name) {
      board.name = req.body.name;
    }

    await DI.boardRepository.persistAndFlush(board);

    return res.json(board);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
