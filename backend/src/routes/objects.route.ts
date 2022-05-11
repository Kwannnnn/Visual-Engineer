import { Router } from 'express';
import { objectController } from '../controllers';

const router: Router = Router();

// Get all objects
router.get('/', objectController.getAll);

// Get an object by ID
router.get('/:tag', objectController.getByTag);

export default router;
