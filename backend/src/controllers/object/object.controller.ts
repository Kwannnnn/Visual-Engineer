import { Request, Response } from 'express';
import DI from '../../DI';
import ValidationError from '../../error/ValidationError';
import { GetTypePropertiesParams } from '../../routes/objects/v2/objects.types';
import { TypedRequest } from '../../routes/util/typed-request';
import getProperties from '../../util/properties/getProperties';
import { getClass } from '../board/board.util';
import types from './objectTypes.json';

export const getAll = async (req: Request, res: Response) => {
  const items = await DI.itemRepository.findAll();
  res.send(items);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const item = await DI.itemRepository.findOne(id);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    return res.json(item);
  } catch (e: any) {
    return res.status(400).json({
      message: e.message,
    });
  }
};

export const getTypeProperties = async (
  req: TypedRequest<GetTypePropertiesParams, unknown>,
  res: Response,
) => {
  const { type } = req.params;

  try {
    const objectType: any = getClass(type);

    const properties = getProperties(objectType);

    return res.json(properties);
  } catch (e: any) {
    let status = 400;

    if (e instanceof ValidationError) {
      status = e.statusCode;
    }

    return res.status(status).json({
      message: e.message,
    });
  }
};

export const getObjectTypes = async (req: Request, res: Response) => {
  res.send(types);
};
