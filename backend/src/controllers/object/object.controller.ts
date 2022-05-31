import { Request, Response } from 'express';
import { Pipeline } from '../../database/models';
import DI from '../../DI';
import ValidationError from '../../error/ValidationError';
import { GetTypePropertiesParams } from '../../routes/objects/v2/objects.types';
import { TypedRequest } from '../../routes/util/typed-request';
import { getPropertyType } from '../../util/properties';
import getProperties from '../../util/properties/getProperties';
import { getClass } from '../board/board.util';

export const getAll = async (req: Request, res: Response) => {
  const items = await DI.itemRepository.findAll();
  res.send(items);
};

export const getByTag = async (req: Request, res: Response) => {
  const { tag } = req.params;

  try {
    const item = await DI.itemRepository.findOne({ tag });

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
