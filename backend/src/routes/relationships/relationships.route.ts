import { Router } from 'express';
import { relationshipController } from '../../controllers';

const relationshipRouter: Router = Router();

relationshipRouter.get('/', relationshipController.getAllRelationships);

relationshipRouter.get('/:pipelineTag', relationshipController.getOneRelationship);

relationshipRouter.delete('/:pipelineTag', relationshipController.deleteRelationship);

export default relationshipRouter;
