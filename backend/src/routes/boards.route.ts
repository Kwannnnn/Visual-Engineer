import { Router } from 'express';
import { boardController } from '../controllers';

const router: Router = Router();

// Get all boards
router.get('/', boardController.getAll);

// Get a board by ID
router.get('/:id', boardController.getById);

// Post a board
router.post('/', boardController.postBoard);

// Post an item to a board
router.post('/:id/items', boardController.postItemToBoard);

export default router;
