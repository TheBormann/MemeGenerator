var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Get an example response
 *     description: Returns a simple example response from the server.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: 'An example response'
 *       500:
 *         description: Internal server error
 */
router.get("/", (req, res) => {
    res.send("An example response")
})

module.exports = router