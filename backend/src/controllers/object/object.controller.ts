import { Request, Response } from 'express';
import { DI } from '../../index';

// export const getAll = async (req: Request, res: Response) => {
//   const items = await DI.itemRepository.findAll();
//   res.send(items);
// };

// export const getByTag = async (req: Request, res: Response) => {
//   const { string: tag } = req.params;

//   try {
//     const item = await DI.itemRepository.find({ tag });

//     if (!item) {
//       return res.status(404).json({
//         message: 'Item not found',
//       });
//     }

//     return res.json(item);
//   } catch (e: any) {
//     return res.status(400).json({
//       message: e.message,
//     });
//   }
// };
