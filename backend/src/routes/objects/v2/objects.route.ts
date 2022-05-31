import { Router } from 'express';
import { objectController } from '../../../controllers';

const objectsRouter: Router = Router();

objectsRouter.get('/types/:type/properties', objectController.getTypeProperties);

export default objectsRouter;
