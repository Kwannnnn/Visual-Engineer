import { Router } from 'express';
import { body } from 'express-validator';
import { relationshipController } from '../../controllers';
import * as middleware from '../../middleware/relationships.middleware';
import validate from '../../middleware/validate';

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
 *        "pipeline": "35u-218d-s21",
 *        "firstItem": "34-s1-32fd"
 *        "secondItem": "d3d2-32s-er"
 *      },
 *        "pipeline": "15n-du3-2y8",
 *        "firstItem": "r33-jds8-o2"
 *        "secondItem": "ddp-0ww-2s9"
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
 *      "pipeline": "35u-218d-s21",
 *      "firstItem": "34-s1-32fd"
 *      "secondItem": "d3d2-32s-er"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with ID <code>{pipelineId}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 */
relationshipRouter.get('/:pipelineId', relationshipController.getOneRelationship);

/**
 * @api {post} /api/v2/relationships Post a relationship
 * @apiDescription Returns a resource response containing
 * the newly posted relationship in the system.
 * @apiVersion 2.0.0
 * @apiName PostRelationship
 * @apiGroup Relationship
 *
 * @apiBody {String} pipeline Pipeline identifier
 * @apiBody {String} firstItem First connected item identifier
 * @apiBody {String} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} object representing the newly added relationship.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "35u-218d-s21",
 *      "firstItem": "34-s1-32fd"
 *      "secondItem": "d3d2-32s-er"
 *    }
 *
 * @apiError PipelineIdMissing The request body is missing the pipeline ID.
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
 * @apiError InvalidRelationship The provided items cannot be associated.
 * @apiErrorExample InvalidRelationship:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "You cannot associate a Pump with a Blower."
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
 *       "message": "Connected item cannot be a pipe item"
 *     }
 */
relationshipRouter.post(
  '/',
  validate([
    body('pipeline')
      .exists()
      .withMessage('Pipeline ID is missing!'),
    body(['firstItem', 'secondItem'])
      .exists()
      .withMessage('Two items are needed to create a relationship.'),
  ]),
  middleware.isPipelineValid,
  middleware.areItemsValid,
  middleware.isPipelineInstanceOfPipeline,
  middleware.areItemsNotInstanceOfPipeline,
  middleware.areConnectedItemsTheSame,
  relationshipController.postRelationship,
);

/**
 * @api {patch} /api/v2/relationships/:pipelineId Update an existing relationship
 * @apiDescription Change the relationship between two items
 * @apiVersion 2.0.0
 * @apiName PatchRelationship
 * @apiGroup Relationship
 *
 * @apiParam {String} pipelineId Relationship identifier
 * @apiBody {String} firstItem First connected item identifier
 * @apiBody {String} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} relationship A resource response containing the
 * updated relationship
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "35u-218d-s21",
 *      "firstItem": "34-s1-32fd"
 *      "secondItem": "d3d2-32s-er"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with id <code>{pipelineId}</code> does not exist
 * @apiErrorExample RelationshipNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Relationship not found"
 *     }
 *
 * @apiError IncorrectBody Body is empty
 * @apiErrorExample IncorrectBody:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Mandatory fields in request body are missing"
 *     }
 *
 * @apiError NonMatchingPipelines Pipeline IDs in request body and parameter do not match
 * @apiErrorExample NonMatchingPipelines:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Pipeline ID in request body does not match"
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
 *
 * @apiError InvalidRelationship The provided items cannot be associated.
 * @apiErrorExample InvalidRelationship:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "You cannot associate a Pump with a Blower."
 *     }
 */
relationshipRouter.patch(
  '/:pipelineId',
  middleware.isRelationshipValid,
  middleware.isRequestBodyValid,
  middleware.areConnectedItemsTheSame,
  middleware.areItemsValid,
  middleware.areItemsNotInstanceOfPipeline,
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
 * @apiParam {String} pipelineId Relationship identifier
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
relationshipRouter.delete('/:pipelineId', relationshipController.deleteRelationship);

export default relationshipRouter;
