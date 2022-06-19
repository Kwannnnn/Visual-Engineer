import { Router } from 'express';
import { relationshipController } from '../../controllers';
import * as relationshipValidator from '../../middleware/relationships.validators';

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
 *        "pipeline": "35",
 *        "firstItem": "34"
 *        "secondItem": "32"
 *      },
 *        "pipeline": "15",
 *        "firstItem": "33"
 *        "secondItem": "9"
 *      {
 *      }
 *    ]
 */
relationshipRouter.get('/', relationshipController.getAllRelationships);

/**
 * @api {get} /api/v2/relationships/:pipelineId Get a specific relationship
 * @apiDescription Returns a resource response containing the specified relationship
 * @apiVersion 2.0.0
 * @apiName GetRelationship
 * @apiGroup Relationship
 *
 * @apiParam {String} pipelineId Relationship identifier
 *
 * @apiSuccess (Success 200) {Relationship} relationship A resource response containing a
 * relationship
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *      "pipeline": "35",
 *      "firstItem": "34"
 *      "secondItem": "32"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with ID <code>{pipelineId}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 */
relationshipRouter.get(
  '/:pipelineId',
  relationshipValidator.getValidators,
  relationshipController.getOneRelationship as any,
);

/**
 * @api {post} /api/v2/relationships Post a relationship
 * @apiDescription Returns a resource response containing
 * the newly posted relationship in the system.
 * @apiVersion 2.0.0
 * @apiName PostRelationship
 * @apiGroup Relationship
 *
 * @apiBody {Integer} pipeline Pipeline identifier
 * @apiBody {Integer} firstItem First connected item identifier
 * @apiBody {Integer} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} object representing the newly added relationship.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "35",
 *      "firstItem": "34"
 *      "secondItem": "32"
 *    }
 *
 * @apiError PipelineTagMissing The request body is missing the pipeline ID.
 * @apiErrorExample PipelineIDMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Pipeline ID is missing."
 *     }
 *
 * @apiError ItemMissing The request body is missing one or both to-be-connected items.
 * @apiErrorExample ItemMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Two items are needed to create a relationship."
 *     }
 *
 * @apiError ItemNotFound Item with identifier <code>pipeline</code>,
 * <code>firstItem</code> or <code>secondItem</code> does not exist.
 * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 *
 * @apiError InvalidConnector The provided pipeline is not an item of type Pipeline.
 * @apiErrorExample InvalidConnector:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "The connector must be of type Pipeline."
 *     }
 *
 * @apiError ConnectItemToItself Items to connect are the same
 * @apiErrorExample ConnectItemToItself:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "First and second item cannot be the same"
 *     }
 *
 * @apiError ConnectPipeToPipe Cannot connect a pipeline to a pipeline
 * @apiErrorExample ConnectPipeToPipe:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Cannot connect a pipeline to a pipeline"
 *     }
 *
 *  * @apiError RelationshipExists When there is an existing relationship with
 * the provided pipeline
 * @apiErrorExample RelationshipExists:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Relationship already exists"
 *     }
 */
relationshipRouter.post(
  '/',
  relationshipValidator.postValidators,
  relationshipController.postRelationship,
);

/**
 * @api {patch} /api/v2/relationships/:pipelineId Update an existing relationship
 * @apiDescription Change the relationship between two items
 * @apiVersion 2.0.0
 * @apiName PatchRelationship
 * @apiGroup Relationship
 *
 * @apiParam {Integer} pipelineId Relationship identifier
 * @apiBody {Integer} firstItem First connected item identifier
 * @apiBody {Integer} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} relationship A resource response containing the
 * updated relationship
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "35",
 *      "firstItem": "34",
 *      "secondItem": "32"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with id <code>{pipelineId}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 *
 * @apiError NonMatchingPipelines Pipeline IDs in request body and parameter do not match
 * @apiErrorExample NonMatchingPipelines:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Pipeline ID in request body does not match"
 *     }
 *
 *  * @apiError PipelineTagMissing The request body is missing the pipeline ID.
 * @apiErrorExample PipelineIDMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Pipeline ID is missing."
 *     }
 *
 * @apiError ItemMissing The request body is missing one or both to-be-connected items.
 * @apiErrorExample ItemMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Two items are needed to create a relationship."
 *     }
 *
 * @apiError ConnectItemToItself Items to connect are the same
 * @apiErrorExample ConnectItemToItself:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "First and second item cannot be the same"
 *     }
 *
 * @apiError ConnectPipeToPipe Cannot connect a pipeline to a pipeline
 * @apiErrorExample ConnectPipeToPipe:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Cannot connect a pipeline to a pipeline"
 *     }
 *
 * @apiError ItemNotFound New item to connect does not exist
 * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 NOT FOUND
 *     {
 *       "message": "Item not found"
 *     }
 */
relationshipRouter.patch(
  '/:pipelineId',
  relationshipValidator.patchValidators,
  relationshipController.patchRelationship,
);

/**
 * @api {delete} /api/v2/relationships/:pipelineId Delete a relationship
 * @apiDescription Returns a successful deletion message or a 404
 * error message if the pipeline or relationship does not exist
 * @apiVersion 2.0.0
 * @apiName DeleteRelationship
 * @apiGroup Relationship
 *
 * @apiParam {Integer} pipelineId Relationship identifier
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 204 No Content
 *
 * @apiError PipelineNotFound Pipeline with ID <code>{pipelineId}</code> does not exist
 * @apiErrorExample PipelineNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Pipeline not found"
 *     }
 *
 * @apiError RelationshipNotFound Relationship with ID <code>{pipelineId}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 */
relationshipRouter.delete(
  '/:pipelineId',
  relationshipValidator.deleteValidators,
  relationshipController.deleteRelationship as any,
);

export default relationshipRouter;
