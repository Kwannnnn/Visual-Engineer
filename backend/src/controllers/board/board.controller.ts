import { Request, Response } from 'express';
import DI from '../../DI';
import { Item, Board } from '../../database/models';
import ValidationError from '../../error/ValidationError';
import { checkRequiredAttributes, getClass } from './board.util';
import {
  BoardObjectParams, BoardParams, FieldError, PatchBoardBody, PatchBoardObject,
} from '../../routes/boards/boards.types';
import { TypedRequest } from '../../routes/util/typed-request';

export const getAll = async (req: Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();
  res.json(boards);
};

export const getById = async (
  req: TypedRequest<BoardParams, any>,
  res: Response,
) => {
  const { id } = req.params;

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

export const getBoardObjects = async (
  req: TypedRequest<BoardParams, any>,
  res: Response,
) => {
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

export const postBoard = async (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(400);
    return res.json({ message: 'Board name is missing' });
  }

  try {
    const board = DI.em.create(Board, req.body);
    await DI.boardRepository.persist(board).flush();

    return res.status(201).json(board);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const postObjectToBoard = async (req: Request, res: Response) => {
  try {
    const id: number = +req.params.id;
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      throw new ValidationError(`Board with id ${id} not found`, 404);
    }

    checkRequiredAttributes(req.body);

    const itemClass = getClass(req.body.type);
    const item: Item = DI.em.create(itemClass, req.body);

    board.items.add(item);
    await DI.em.flush();

    res.status(201);
    return res.json(item);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      return res.status(e.statusCode).json({
        message: e.message,
      });
    }

    return res.status(400).json({
      message: e.message,
    });
  }
};

export const patchById = async (
  req: TypedRequest<BoardParams, PatchBoardBody>,
  res: Response,
) => {
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

    const item = await DI.itemRepository.findOne(objectId);

    if (!item || !items.contains(item)) {
      return res.status(404).json({
        message: 'Object not found',
      });
    }

    const hiddenFields = ['__gettersDefined', 'board', 'id'];

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

    return res.json(item);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteBoard = async (
  req: TypedRequest<BoardParams, any>,
  res: Response,
) => {
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
    await DI.itemRepository.removeAndFlush(items);
    DI.boardRepository.removeAndFlush(board);

    return res.status(204).send();
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const deleteObjectFromBoard = async (
  req: TypedRequest<BoardObjectParams, any>,
  res: Response,
) => {
  const { id, objectId } = req.params;

  try {
    const board = await DI.boardRepository.findOne(id);

    if (!board) {
      return res.status(404).json({
        message: 'Board not found',
      });
    }
    await board.items.init();

    const item = await DI.itemRepository.findOne(objectId);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    DI.itemRepository.removeAndFlush(item);
    board.items.remove(item);

    return res.status(204).send();
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
