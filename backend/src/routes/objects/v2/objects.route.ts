import { Router } from 'express';
import { objectController } from '../../../controllers';

const objectsRouter: Router = Router();

/**
 * @api {get} /api/v2/objects/types/:type/properties Get object properties
 * @apiDescription Returns an array of properties for a given object type
 * @apiVersion 2.0.0
 * @apiName GetObjectProperties
 * @apiGroup Object
 * @apiParam {String} type Object type discriminator (pipeline, tank, etc)
 * @apiSuccess (Success 200) {Property[]} properties List of object properties, including their type
 * @apiSuccessExample Success-Response-Pipeline:
 * HTTP/1.1 200 OK
 *      [
 *          {
 *              "name": "name",
 *              "type": "string"
 *          },
 *          {
 *              "name": "length",
 *              "type": "number"
 *          },
 *          {
 *              "name": "width",
 *              "type": "number"
 *          },
 *          {
 *              "name": "depth",
 *              "type": "number"
 *          },
 *          {
 *              "name": "diameter",
 *              "type": "number"
 *          },
 *          {
 *              "name": "pressureClass",
 *              "type": "string"
 *          },
 *          {
 *              "name": "flange",
 *              "type": "string"
 *          },
 *          {
 *              "name": "lining",
 *              "type": "string"
 *          }
 *      ]
 * @apiError UnknownObject Used when an invalid type is used
 * @apiErrorExample Error-Response-UnknownObject:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Unknown Item type"
 *     }
 */
objectsRouter.get('/types/:type/properties', objectController.getTypeProperties);

export default objectsRouter;
