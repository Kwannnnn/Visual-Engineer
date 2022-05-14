import { Router } from 'express';
import { boardController } from '../controllers';

const router: Router = Router();

// Get all boards
router.get('/', boardController.getAll);

export default router;
