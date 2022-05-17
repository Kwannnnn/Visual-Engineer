import { Router } from 'express';
import { body } from 'express-validator';
import { boardController } from '../../controllers';
import validate from '../../middleware/validate';

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
 * @apiErrorExample Error-Response-NotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 * @apiErrorExample Error-Response-InvalidFields:
 *
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errors": [
 *          {
 *              "msg": "Invalid value",
 *              "param": "name",
 *              "location": "body"
 *          }
 *       ]
 *     }
 */
router.patch('/:id', validate([
  body('name').isAlphanumeric(),
]), boardController.patchById as any);

export default router;
