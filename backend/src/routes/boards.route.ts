import { Router } from 'express';
import { boardController } from '../controllers';

const router: Router = Router();

// Get all boards
router.get('/', boardController.getAll);

// Get board by id
router.get('/:id', boardController.getById);

// Get objects from a specific board
router.get('/:id/objects', boardController.getBoardObjects);

export default router;
