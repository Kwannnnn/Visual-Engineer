import { Request, Response } from 'express';
import DI from '../../DI';
import { Item, Board } from '../../database/models';
import ValidationError from '../../error/ValidationError';
import { checkRequiredAttributes, getClass } from './board.util';
import {
  BoardObjectParams, BoardParams, PatchBoardBody, PatchBoardObject,
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
  try {
    const { board } = res.locals;

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
  try {
    const { board } = res.locals;

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
  try {
    const board = DI.em.create(Board, req.body);
    await DI.boardRepository.persist(board).flush();

    return res.status(201).json(board);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      return res.status(e.statusCode).json({
        message: e.message,
      });
    }
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const postObjectToBoard = async (req: Request, res: Response) => {
  try {
    const id: number = +req.params.id;
    const board = await DI.boardRepository.findOne(id);

    checkRequiredAttributes(req.body);

    const itemClass = getClass(req.body.type);
    const item: Item = DI.em.create(itemClass, req.body);

    board!.items.add(item);
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
  try {
    const { board } = res.locals;

    if (req.body?.name) {
      board!.name = req.body.name;
    }

    await DI.boardRepository.persistAndFlush(board!);

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
  try {
    const { board } = res.locals;
    const { item } = res.locals;

    const hiddenFields = ['__gettersDefined', 'board', 'id'];

    const properties = Object.getOwnPropertyNames(item).filter(((p) => !hiddenFields.includes(p)));

    // eslint-disable-next-line consistent-return
    Object.keys(req.body!).forEach((param) => {
      if (!properties.includes(param)) {
        throw new ValidationError('Illegal field', 400);
      }
    });

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
  try {
    const { board } = res.locals;

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
  try {
    const { board } = res.locals;
    await board.items.init();

    const { item } = res.locals;

    DI.itemRepository.removeAndFlush(item);
    board.items.remove(item);

    return res.status(204).send();
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
