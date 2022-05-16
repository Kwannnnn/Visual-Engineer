import { Request, Response } from 'express';
import { DI } from '../../index';

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
        })
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
        })
    }
};
