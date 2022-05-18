import { Request, Response } from 'express';
import DI from '../../DI';
import {
    Board, Pipeline, Blower, PipeFitting, Pump, Tank, Vessel,
} from '../../database/models';

function checkTypeSpecificAttributes(body: any): boolean {
    let attributesExist: boolean = true;
    switch (body.type) {
        case 'blower': {
            // all additioal attributes are optional
            break;
        }
        case 'pipeFitting': {
            if (!body.pressureClass) {
                attributesExist = false;
            }
            break;
        }
        case 'pipeline': {
            if (!body.pressureClass) {
                attributesExist = false;
            }
            break;
        }
        case 'pump': {
            // all additioal attributes are optional
            break;
        }
        case 'tank': {
            // all additioal attributes are optional
            break;
        }
        case 'vessel': {
            // all additioal attributes are optional
            break;
        }
        default:
    }

    return attributesExist;
}

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
    // general check for all items
    if (!req.body.tag
        || !req.body.name
        || !req.body.length
        || !req.body.width
        || !req.body.depth
        || !req.body.diameter
        || !req.body.type
        || !checkTypeSpecificAttributes(req.body) // check type-specific attributes
    ) {
        res.status(400);
        return res.json({ message: 'One or more Item properties are missing' });
    }

    try {
        const id: number = +req.params.id;
        const board = await DI.boardRepository.findOne(id);

        if (!board) {
            return res.status(404).json({
                message: 'Board not found',
            });
        }

        let item: any;

        switch (req.body.type) {
            case 'blower': {
                item = DI.em.create(Blower, req.body);
                break;
            }
            case 'pipeFitting': {
                item = DI.em.create(PipeFitting, req.body);
                break;
            }
            case 'pipeline': {
                item = DI.em.create(Pipeline, req.body);
                break;
            }
            case 'pump': {
                item = DI.em.create(Pump, req.body);
                break;
            }
            case 'tank': {
                item = DI.em.create(Tank, req.body);
                break;
            }
            case 'vessel': {
                item = DI.em.create(Vessel, req.body);
                break;
            }
            default:
        }

        board.items.add(item);
        await DI.em.flush();

        res.status(201);
        return res.json(item);
    } catch (e: any) {
        return res.status(400).json({
            message: e.message,
        });
    }
};
