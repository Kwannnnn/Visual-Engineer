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
 * @apiError ItemMissing The request body is missing one or both to-be-connected items.
 * @apiError ItemNotFound Item with identifier <code>pipeline</code>,
 * <code>firstItem</code> or <code>secondItem</code> does not exist.
 * @apiError InvalidConnector The provided pipeline is not an item of type Pipeline.
 * @apiError InvalidRelationship The provided items cannot be associated.
 * @apiErrorExample PipelineTagMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Pipeline tag is missing."
 *     }
 *
 * @apiErrorExample ItemMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Two items are needed to create a relationship."
 *     }
 *
 *  * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 *
 *  * @apiErrorExample InvalidConnector:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "The connector must be of type Pipeline."
 *     }
 *
 *  @apiErrorExample InvalidConnector:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "You cannot associate a Pump with a Blower."
 *     }
 */
relationshipRouter.post('/', relationshipController.postRelationship);

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
