import { Router } from 'express';
import { boardController } from '../../controllers';

const boardRouter: Router = Router();

// Get all boards
boardRouter.get('/', boardController.getAll);

// Get a board by ID
boardRouter.get('/:id', boardController.getById);


// Delete a board by ID
boardRouter.delete('/:id', boardController.deleteBoard);

// Delete an item from a board
boardRouter.delete('/:id/items/:tag', boardController.deleteItemfromBoard);

export default boardRouter;

