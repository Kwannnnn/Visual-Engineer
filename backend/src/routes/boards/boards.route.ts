import { Router } from 'express';
import { boardController } from '../../controllers';
import * as boardValidators from '../../middleware/boards.validators';

const router: Router = Router();

/**
 * @api {get} /api/v1/boards Get all boards
 * @apiDescription Returns a resource response containing all fields for every board in the system.
 * @apiVersion 1.0.0
 * @apiName GetBoards
 * @apiGroup Board
 *
 * @apiSuccess (Success 200) {Board[]} boards List of board items
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     [
 *       {
 *          "name": "PTPFu01",
 *       },
 *       {
 *          "name": "PTPFu02",
 *       }
 *     ]
 */
router.get('/', boardController.getAll);

/**
 * @api {get} /api/v1/boards/:id Get a specific board by its identifier
 * @apiDescription Returns a resource response containing the specified board.
 * @apiVersion 1.0.0
 * @apiName GetBoard
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 *
 * @apiSuccess (Success 200) {Board} board A resource response containing a board.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id": 1,
 *        "name": "PTPFu01",
 *     }
 *
 * @apiError BoardNotFound Board with id <code>{id}</code> does not exist
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.get(
  '/:id',
  boardValidators.isBoard,
  boardController.getById as any,
);

/**
 * @api {get} /api/v1/boards/:id/objects Get all objects from a specific board
 * @apiDescription Returns a resource response containing all objects for a specific
 * board in the system. Returns a 404 error message if no such board is found.
 * @apiVersion 1.0.0
 * @apiName GetBoardObjects
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 *
 * @apiSuccess (Success 200) {Object[]} objects List of object items of a specific board
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *       {
 *          "id": "112-3sa2-da2",
 *          "tag": "BL01",
 *          "name": "Blower",
 *          "length": "23",
 *          "width": "23",
 *          "depth": "23",
 *          "diameter": "23",
 *          "x": "50",
 *          "y": "50"
 *       },
 *       {
 *          "id": "113-7d87-aa2",
 *          "tag": "PU01",
 *          "name": "Pump",
 *          "length": "37",
 *          "width": "37",
 *          "depth": "37",
 *          "diameter": "37",
 *          "x": "25",
 *          "y": "25"
 *       }
 *     ]
 * @apiUse BoardNotFoundError
 */
router.get(
  '/:id/objects',
  boardValidators.isBoard,
  boardController.getBoardObjects as any,
);

/**
 * @api {patch} /api/v1/boards/:id Update a specific board by its identifier
 * @apiDescription Updates the fields of a board,
 * and returns a resource response containing the specified board.
 * Returns a 404 error message if no such board is found.
 * @apiVersion 1.0.0
 * @apiName PatchBoard
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 *
 * @apiSuccess (Success 200) {Board} board A resource response containing a board.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id": 1,
 *        "name": "PTPFu02",
 *     }
 * @apiUse BoardNotFoundError
 * @apiUse InvalidFields
 */
router.patch(
  '/:id',
  boardValidators.validateRequestBody,
  boardController.patchById as any,
);

/**
 * @api {patch} /api/v1/boards/:id/objects/:objectId Update a specific object in a board
 * @apiDescription Patches fields for a given object in a board.
 * @apiVersion 1.0.0
 * @apiName PatchBoardObject
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 * @apiParam {String} objectId Object ID
 *
 * @apiSuccess (Success 200) {Object} object The updated board object
 * @apiSuccessExample Success-Response:
*      HTTP/1.1 200 OK
 *       {
 *          "id": "112-3sa2-da2",
 *          "tag": "BL01",
 *          "name": "Blower",
 *          "length": "23",
 *          "width": "23",
 *          "depth": "23",
 *          "diameter": "23",
 *          "x": "50",
 *          "y": "50"
 *       },
 *       }
 * @apiUse BoardNotFoundError
 * @apiUse ObjectNotFoundError
 * @apiUse InvalidFields
 */
router.patch(
  '/:id/objects/:objectId',
  boardValidators.isBoardObject,
  boardController.patchBoardObjects as any,
);

/**
 * @api {post} /api/v1/boards Post a board
 * @apiDescription Returns a resource response containing the newly posted board in the system.
 * Returns a 400 error message if the board name is missing.
 * @apiVersion 1.0.0
 * @apiName PostBoard
 * @apiGroup Board
 *
 * @apiBody {String} name Name of the board to be added
 *
 * @apiSuccess (Success 200) {Board} board A resource response containing a board.
 * @apiSuccessExample Success-Response:
 * * HTTP/1.1 201 CREATED
 *       {
 *          "id": 1,
 *          "items": [],
 *          "name": "new board",
 *       }
 * @apiError BoardNameMissing: The <code>name</code> field of the request body is missing.
 * @apiError BoardNotFound: Board with identifier <code>id</code> does not exist.
 *  @apiErrorExample BoardNameMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Board name missing"
 *     }
 * @apiErrorExample BoardNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.post(
  '/',
  boardValidators.postBoard,
  boardController.postBoard,
);

/**
 * @api {post} /api/v1/boards/:id/objects Post an object to a specific board
 * @apiDescription Posts an object to a board and returns the object.
 * Returns a 404 error message if the board is not found.
 * Returns a 400 error message if the required item attributes are missing.
 * @apiVersion 1.0.0
 * @apiName PostBoardObjects
 * @apiGroup Board
 *
 * @apiParam {Number} id Board identifier
 * @apiBody {String} type Type of the object
 * @apiBody {String} [tag] tag Tag of the object
 * @apiBody {Float} x X coordinate of the object on the board
 * @apiBody {Float} y Y coordinate of the object on the board
 * @apiBody {String} [name] Name of the object
 * @apiBody {Float} [length] Length of the object
 * @apiBody {Float} [width] Width of the object
 * @apiBody {Float} [depth] Depth of the object
 * @apiBody {Float} [diameter] Diameter of the object
 * @apiBody {String} [flange] Flange property if object is of type 'Pipeline'
 * @apiBody {String} [lining] Lining property if object is of type 'Pipeline'
 * @apiBody {Float} [emptyMass] Empty mass property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} [head] Head property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} [filledMass] Filled mass property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} [netVolume] Net volume property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} [grossVolume] Gross volume property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} [preliminaryPower] Preliminary power property
 *                  if object is of type 'RotatingEquipment'
 * @apiBody {Float} [finalPower] Final power property if object is of type 'RotatingEquipment'
 *
 * @apiSuccess (Success 201) {Object} object representing the newly added object
 * @apiSuccessExample Success-Response:
 * * HTTP/1.1 201 CREATED
 *       {
 *          "id": "bui4-d23-d32y"
 *          "tag": "#583FA293",
 *          "name": "Cleaner",
 *          "length": 2.52,
 *          "width": 2.35,
 *          "depth": 1.47,
 *          "diameter": 1.79,
 *          "type": "pump",
 *          "emptyMass": 69,
 *          "head": 1,
 *          "filledMass": 5.4,
 *          "netVolume": 12.3,
 *          "grossVolume": 23.7,
 *          "preliminaryPower": 454,
 *          "finalPower": 600,
 *          "x": 102.38,
 *          "y": 199.5,
 *          "board": {
 *              "id": 1,
 *              "name": "asd"
 *          }
 *      }
 * @apiError ItemAttributeMissing: The request body is missing a required attribute.
 * @apiError BoardNotFound: Board with identifier <code>id</code> does not exist.
 *  @apiErrorExample ItemAttributeMissing:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "One or more Item attributes are missing"
 *     }
 *  @apiErrorExample BoardNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.post(
  '/:id/objects',
  boardValidators.validateRequestBody,
  boardController.postObjectToBoard,
);

/**
 * @api {delete} /api/v1/boards/:id Delete a board
 * @apiDescription Returns a successful deletion message or a 404
 * error message if the board does not exist
 * @apiVersion 1.0.0
 * @apiName DeleteBoard
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 204 No Content
 *
 * @apiError BoardNotFound Board with id <code>{id}</code> does not exist
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.delete(
  '/:id',
  boardValidators.isBoard,
  boardController.deleteBoard as any,
);

/**
 * @api {delete} /api/v1/boards/:id/objects/:objectId Delete an item from a board
 * @apiDescription Returns a successful deletion message or a 404
 * error message if the board or item does not exist
 * @apiVersion 1.0.0
 * @apiName DeleteObjectFromBoard
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 * @apiParam {String} objectId Object identifier
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 204 No Content
 *
 * @apiError BoardNotFound Board with id <code>{id}</code> does not exist
 * @apiErrorExample BoardNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 *
 * @apiError ItemNotFound Item with id <code>{objectId}</code> does not exist
 * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 */
router.delete(
  '/:id/objects/:objectId',
  boardValidators.isBoardObject,
  boardController.deleteObjectFromBoard as any,
);

export default router;

// apidoc definitions

/**
* @apiDefine BoardNotFoundError
* @apiVersion 1.0.0
* @apiError BoardNotFound Returns a 404 error message if no such board is found
* @apiErrorExample Error-Response-BoardNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
* */

/**
* @apiDefine ObjectNotFoundError
* @apiVersion 1.0.0
* @apiError ObjectNotFound Returns a 404 error message if no such object is found
* @apiErrorExample Error-Response-ObjectNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Object not found"
 *     }
* */

/**
* @apiDefine InvalidFields
* @apiVersion 1.0.0
* @apiError IllegalFields Returns an array of illegal field validation errors
* @apiErrorExample Error-Response-IllegalFields:
*     HTTP/1.1 400 Bad Request
*     {
*       "errors": [
*          {
*            "msg": "Illegal field",
*            "param": "lining",
*            "location": "body"
*          }
*        ]
*     }
* */
