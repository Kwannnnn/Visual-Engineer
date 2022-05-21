import { Request, Response } from 'express';
import DI from '../../DI';
import { Item, Board } from '../../database/models';
import ValidationError from '../../error/ValidationError';
import { checkCommonItemAttributes, checkTypeSpecificAttributes, getClass } from './board.util';

export const getAll = async (req: Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();
  res.json(boards);
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

    checkCommonItemAttributes(req.body);
    checkTypeSpecificAttributes(req.body);

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
