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

/**
 * @api {post} /api/v2/relationships Post a relationship
 * @apiDescription Returns a resource response containing
 * the newly posted relationship in the system.
 * @apiVersion 2.0.0
 * @apiName PostRelationship
 * @apiGroup Relationship
 *
 * @apiBody {String} pipeline Pipeline tag identifier
 * @apiBody {String} firstItem First connected item identifier
 * @apiBody {String} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} object representing the newly added relationship.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "122-12sa-gi2",
 *      "firstItem": "345-hg2-wru3"
 *      "secondItem": "321-ji0q-112"
 *    }
 *
 * @apiError PipelineTagMissing The request body is missing the pipeline tag.
 * @apiErrorExample PipelineTagMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Pipeline tag is missing."
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
      .withMessage('Pipeline tag is missing!'),
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
 * @api {patch} /api/v2/relationships/:pipelineTag Update an existing relationship
 * @apiDescription Change the relationship between two items
 * @apiVersion 2.0.0
 * @apiName PatchRelationship
 * @apiGroup Relationship
 *
 * @apiParam {String} pipelineTag Relationship identifier
 * @apiBody {String} pipeline Pipeline tag identifier
 * @apiBody {String} firstItem First connected item identifier
 * @apiBody {String} secondItem Second connected item identifier
 *
 * @apiSuccess (Success 201) {Relationship} relationship A resource response containing the
 * updated relationship
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 CREATED
 *    {
 *      "pipeline": "122-12sa-gi2",
 *      "firstItem": "345-hg2-wru3"
 *      "secondItem": "456-ji0q-rt4g"
 *    }
 *
 * @apiError RelationshipNotFound Relationship with tag <code>{pipelineTag}</code> does not exist
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
 * @apiError NonMatchingPipelines Pipeline tags in request body and parameter do not match
 * @apiErrorExample NonMatchingPipelines:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *       "message": "Pipeline tag in request body does not match"
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
  '/:pipelineTag',
  middleware.isRelationshipValid,
  middleware.isRequestBodyValid,
  middleware.arePipelinesMatching,
  middleware.areConnectedItemsTheSame,
  middleware.areItemsValid,
  middleware.areItemsNotInstanceOfPipeline,
  relationshipController.patchRelationship,
);

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
