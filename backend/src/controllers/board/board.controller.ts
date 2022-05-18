import { Request, Response } from 'express';
import DI from '../../DI';
import {
  BoardObjectParams, BoardParams, FieldError, PatchBoardBody, PatchBoardObject,
} from '../../routes/boards/boards.types';
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

export const patchBoardObjects = async (
  req: TypedRequest<BoardObjectParams, PatchBoardObject>,
  res: Response,
) => {
  const { id: boardId, objectId } = req.params;

  try {
    const board = await DI.boardRepository.findOne({ id: boardId }, { populate: ['items'] });

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }

    const { items } = board;

    const item = await DI.itemRepository.findOne({ tag: objectId });

    if (!item || !items.contains(item)) {
      return res.status(404).json({
        message: 'Object not found',
      });
    }

    const hiddenFields = ['__gettersDefined', 'board', 'tag'];

    const properties = Object.getOwnPropertyNames(item).filter(((p) => !hiddenFields.includes(p)));

    const fieldErrors: FieldError[] = [];

    Object.keys(req.body!).forEach((param) => {
      if (!properties.includes(param)) {
        fieldErrors.push({
          msg: 'Illegal field',
          param,
          location: 'body',
        });
      }
    });

    if (fieldErrors.length > 0) {
      return res.status(400).json({ errors: fieldErrors });
    }

    Object.assign(item, req.body);

    await DI.boardRepository.persistAndFlush(board);

    return res.json(board);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
