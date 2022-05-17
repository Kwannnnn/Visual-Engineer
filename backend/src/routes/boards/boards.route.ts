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
 *
 * @apiError BoardNotFound Board with id <code>{id}</code> does not exist
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
 *
 *  @apiError BoardNotFound Board with id <code>{id}</code> does not exist
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Board not found"
 *     }
 */
router.get('/:id/objects', boardController.getBoardObjects);

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
router.delete('/:id', boardController.deleteBoard);

/**
 * @api {delete} /api/v1/boards/:id/objects/:tag Delete an item from a board
 * @apiDescription Returns a successful deletion message or a 404
 * error message if the board or item does not exist
 * @apiVersion 1.0.0
 * @apiName DeleteObjectFromBoard
 * @apiGroup Board
 *
 * @apiParam {Integer} id Board identifier
 *           {String} tag Item identifier
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
 * @apiError ItemNotFound Item with id <code>{id}</code> does not exist
 * @apiErrorExample ItemNotFound:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 */
router.delete('/:id/objects/:tag', boardController.deleteObjectFromBoard);

export default router;
