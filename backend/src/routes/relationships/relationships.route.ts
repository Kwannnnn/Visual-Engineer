import { Router } from 'express';
import { relationshipController } from '../../controllers';

const relationshipRouter: Router = Router();

/**
 * @api {get} /api/v2/relationships Get all relationships
 * @apiDescription Returns a resource response containing all fields for every relationship in the
 * system
 * @apiVersion 2.0.0
 * @apiName GetRelationships
 * @apiGroup Relationship
 *
 * @apiSuccess (Success 200) {Relationship[]} relationships List of relationship items
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *    [
 *      {
 *        "pipeline": "122-12sa-gi2",
 *        "firstItem": "345-hg2-wru3"
 *        "secondItem": "321-ji0q-112"
 *      },
 *        "pipeline": "as2-887d-gi2",
 *        "firstItem": "34we-h62-yru3"
 *        "secondItem": "09i1-jjkq-1n12"
 *      {
 *      }
 *    ]
 */
relationshipRouter.get('/', relationshipController.getAllRelationships);

/**
 * @api {get} /api/v2/relationships/:pipelineTag Get a specific relationship
 * @apiDescription Returns a resource response containing the specified relationship
 * @apiVersion 2.0.0
 * @apiName GetRelationship
 * @apiGroup Relationship
 *
 * @apiParam {String} pipelineTag Relationship identifier
 *
 * @apiSuccess (Success 200) {Relationship} relationship A resource response containing a
 * relationship
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *      "pipeline": "122-12sa-gi2",
 *      "firstItem": "345-hg2-wru3"
 *      "secondItem": "321-ji0q-112"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with tag <code>{pipelineTag}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 */
relationshipRouter.get('/:pipelineTag', relationshipController.getOneRelationship);

relationshipRouter.patch('/:pipelineTag', relationshipController.patchRelationship);

/**
 * @api {delete} /api/v2/relationships/:pipelineTag Delete a relationship
 * @apiDescription Returns a successful deletion message or a 404
 * error message if the pipeline or relationship does not exist
 * @apiVersion 2.0.0
 * @apiName DeleteRelationship
 * @apiGroup Relationship
 *
 * @apiParam {String} pipelineTag Relationship identifier
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 204 No Content
 *
 * @apiError PipelineNotFound Pipeline with tag <code>{pipelineTag}</code> does not exist
 * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Pipeline not found"
 *     }
 *
 * @apiError RelationshipNotFound Relationship with tag <code>{pipelineTag}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 */
relationshipRouter.delete('/:pipelineTag', relationshipController.deleteRelationship);

export default relationshipRouter;
