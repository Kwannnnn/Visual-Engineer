import { Router } from 'express';
import { objectController } from '../../../controllers';

const objectsRouter: Router = Router();

/**
 * @api {get} /api/v1/objects Get all objects
 * @apiDescription Returns a resource response containing all fields for every object in the system.
 * @apiVersion 2.0.0
 * @apiName GetObjects
 * @apiGroup Object
 * @apiDeprecated use (#Board:GetBoardObjects)
 * @apiSuccess (Success 200) {Object[]} objects List of object items
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     [
 *       {
 *          "tag": "112-3sa2-da2",
 *          "name": "Blower",
 *          "length": "69",
 *          "width": "69",
 *          "depth": "69",
 *          "diameter": "69"
 *       },
 *       {
 *          "tag": "113-7d87-aa2",
 *          "name": "Pump",
 *          "length": "37",
 *          "width": "37",
 *          "depth": "37",
 *          "diameter": "37"
 *       }
 *     ]
 */
objectsRouter.get('/', objectController.getAll);

/**
 * @api {get} /api/v1/objects/:tag Get a specific object by its identifier
 * @apiDescription Returns a resource response containing the specified object. Returns a 404 error
 * message if no such object is found.
 * @apiVersion 2.0.0
 * @apiDeprecated use (#Board:GetBoardObjects) to fetch all board items instead
 * @apiName GetObject
 * @apiGroup Object
 * @apiParam {String} tag Object identifier
 * @apiSuccess (Success 200) {Object} object A resource response containing an object.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "tag": "112-3sa2-da2",
 *        "name": "Blower",
 *        "length": "69",
 *        "width": "69",
 *        "depth": "69",
 *        "diameter": "69"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 */
objectsRouter.get('/:id', objectController.getById);

export default objectsRouter;
