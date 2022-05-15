import { Router } from 'express';
import { boardController } from '../../controllers';

const boardRouter: Router = Router();


// // Get all boards
// router.get('/', boardController.getAll);

// // Get a board by ID
// router.get('/:id', boardController.getById);


// Delete a board by ID
boardRouter.delete('/:id', boardController.deleteBoard);
// Delete an item from a board

export default boardRouter;

