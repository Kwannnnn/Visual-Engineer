import { Router } from 'express';
import { objectController } from '../../../controllers';
import objectValidators from '../../../middleware/objects.validators';

const objectsRouter: Router = Router();

/**
 * @api {get} /api/v1/objects Get all objects
 * @apiDescription Returns a resource response containing all fields for every object in the system.
 * @apiVersion 3.0.0
 * @apiName GetObjects
 * @apiGroup Object
 * @apiDeprecated use (#Board:GetBoardObjects)
 * @apiSuccess (Success 200) {Object[]} objects List of object items
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     [
 *       {
 *          "id": "12",
 *          "tag": "112-3sa2-da2",
 *          "name": "Blower",
 *          "length": "23",
 *          "width": "23",
 *          "depth": "23",
 *          "diameter": "23",
 *          "x": "50",
 *          "y": "50"
 *       },
 *       {
 *          "id": "34",
 *          "tag": "113-7d87-aa2",
 *          "name": "Pump",
 *          "length": "37",
 *          "width": "37",
 *          "depth": "37",
 *          "diameter": "37",
 *          "x": "25",
 *          "y": "25"
 *       }
 *     ]
 */
objectsRouter.get('/', objectController.getAll);

/**
 * @api {get} /api/v1/objects/:id Get a specific object by its identifier
 * @apiDescription Returns a resource response containing the specified object. Returns a 404 error
 * message if no such object is found.
 * @apiVersion 3.0.0
 * @apiDeprecated use (#Board:GetBoardObjects) to fetch all board items instead
 * @apiName GetObject
 * @apiGroup Object
 * @apiParam {Integer} id Object identifier
 * @apiSuccess (Success 200) {Object} object A resource response containing an object.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id": " 12",
 *        "tag": "112-3sa2-da2",
 *        "name": "Blower",
 *        "length": "23",
 *        "width": "23",
 *        "depth": "23",
 *        "diameter": "23",
 *        "x": "50",
 *        "y": "50"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 */
objectsRouter.get(
  '/:id',
  objectValidators,
  objectController.getById,
);

export default objectsRouter;
