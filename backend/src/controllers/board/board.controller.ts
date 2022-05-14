import { Request, Response } from 'express';
import { DI } from '../../index';

export const getAll = async (req:Request, res: Response) => {
  const boards = await DI.boardRepository.findAll();

  res.send(boards);
};
