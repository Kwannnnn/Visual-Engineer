import { Router } from 'express';
import { boardController } from '../../controllers';

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
 * @apiDescription Returns a resource response containing the specified board. Returns a 404 error
 * message if no such board is found.
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
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.get('/:id', boardController.getById);

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
*      HTTP/1.1 200 OK
 *      [
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
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.get('/:id/objects', boardController.getBoardObjects);

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
 * @apiSuccess (Success 201) {Object} A resource response containing an object
 * @apiSuccessExample Success-Response:
 * * HTTP/1.1 201 CREATED
 *       {
 *          "id": 1,
 *          "items": [],
 *          "name": "new board",
 *       }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Board name missing"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.post('/', boardController.postBoard);

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
 * @apiBody {String} tag Unique tag of the object
 * @apiBody {String} name Name of the object
 * @apiBody {Float} length Length of the object
 * @apiBody {Float} width Width of the object
 * @apiBody {Float} depth Depth of the object
 * @apiBody {Float} diameter Diameter of the object
 * @apiBody {String} type Type of the object
 * @apiBody {String} flange Flange property if object is of type 'Pipeline'
 * @apiBody {String} lining Lining property if object is of type 'Pipeline'
 * @apiBody {Float} emptyMass Empty mass property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} head Head property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} filledMass Filled mass property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} netVolume Net volume property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} grossVolume Gross volume property if object is of type 'MechanicalEquipment'
 * @apiBody {Float} preliminaryPower Preliminary power property
 *                  if object is of type 'RotatingEquipment'
 * @apiBody {Float} finalPower Final power property if object is of type 'RotatingEquipment'
 *
 * @apiSuccess (Success 201) {Object} object representing the newly added object
 * @apiSuccessExample Success-Response:
 * * HTTP/1.1 201 CREATED
 *       {
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
 *          "board": {
 *              "id": 1,
 *              "name": "asd"
 *          }
 *      }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "One or more Item attributes are missing"
 *     }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.post('/:id/objects', boardController.postObjectToBoard);

export default router;
