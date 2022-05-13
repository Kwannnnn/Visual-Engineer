import { Request, Response } from 'express';
import DI from '../../DI';
import { Item, Board } from '../../database/models';

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

export const postBoard = async (req: Request, res: Response) => {
    if (!req.body.name) {
        res.status(400)
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

export const postItemToBoard = async (req: Request, res: Response) => {
    if (!req.body.tag
        || !req.body.name
        || !req.body.length
        || !req.body.width
        || !req.body.depth
        || !req.body.diameter
        ) {
        res.status(400)
        return res.json({ message: 'Item properties are missing' });
    }

    try {
        const id: number = +req.params.id;
        const board = await DI.boardRepository.findOne(id);

        if (!board) {
            return res.status(404).json({
                message: 'Board not found',
            });
        }

        const item = DI.em.create(Item, req.body);
        board.items.add(item)
        await DI.em.flush();

        res.status(201)
        return res.json(board);
    } catch (e: any) {
        return res.status(400).json({
            message: e.message,
        });
    }
};