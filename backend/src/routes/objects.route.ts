import { Router } from 'express';
import { objectController } from '../controllers';

const objectsRouter: Router = Router();

// Get all objects
objectsRouter.get('/', objectController.getAll);

// Get an object by ID
objectsRouter.get('/:tag', objectController.getByTag);

export default objectsRouter;
