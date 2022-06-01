// Historical Apidoc definitions

/**
 * @api {get} /api/v1/objects Get all objects
 * @apiDescription Returns a resource response containing all fields for every object in the system.
 * @apiVersion 1.0.0
 * @apiName GetObjects
 * @apiGroup Object
 * @apiSuccess (Success 200) {Object[]} objects List of object items
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     [
 *       {
 *          "tag": "112-3sa2-da2",
 *          "name": "Blower",
 *          "length": "2.3",
 *          "width": "1.3",
 *          "depth": "0.5",
 *          "diameter": "1.2"
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

/**
 * @api {get} /api/v1/objects/types Get all object types
 * @apiDescription Returns a resource response containing all object types in the system and their
 *                 hierachy.
 * @apiVersion 2.0.0
 * @apiName GetObjectTypes
 * @apiGroup Object
 *
 * @apiSuccess (Success 200) {Object[]} types JSON objects with object types arranged in a
 *                                            hierachical manner
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *     [{
 *       "group": "Item",
 *       "subsets": [
 *         {
 *           "group": "Pipe Item",
 *           "items": [
 *             { "name": "Pipe Fitting" }
 *           ],
 *         },
 *         {
 *           "group": "Mechanical Equipment",
 *           "subsets": [
 *             {
 *               "group": "Rotating Equipment",
 *               "items": [
 *                 { "name": "Pump" },
 *                 { "name": "Blower" }
 *               ],
 *             },
 *             {
 *               "group": "Static Equipment",
 *               "items": [
 *                 { "name": "Tank" },
 *                 { "name": "Vessel" }
 *               ],
 *             }
 *           ],
 *         }
 *       ]
 *     }]
 */
objectsRouter.get('/types', objectController.getObjectTypes);

/**
 * @api {get} /api/v1/objects/:tag Get a specific object by its identifier
 * @apiDescription Returns a resource response containing the specified object. Returns a 404 error
 * message if no such object is found.
 * @apiVersion 1.0.0
 * @apiName GetObject
 * @apiGroup Object
 * @apiParam {String} tag Object identifier
 * @apiSuccess (Success 200) {Object} object A resource response containing an object.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "tag": "112-3sa2-da2",
 *        "name": "Blower",
 *        "length": "12",
 *        "width": "1.2",
 *        "depth": "3.2",
 *        "diameter": "2"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Item not found"
 *     }
 */
