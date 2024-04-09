var express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/authenticateToken.js");
var router = express.Router();


router.get("/userMemes",authenticateToken, async (req, res) => {
    // Get query parameters or set default values
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const author = req.user.username; // Get the author (current user's username) from the JWT

    console.log(page, limit);

    const results = {};

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    results.next = null;
    if (endIndex < memes.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }
    results.prev = null;
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
            limit: limit
        };
    }

    // Filter memes array to include only memes from the current author
    results.results = memes.filter(meme => meme.author === author).slice(startIndex, endIndex);

    const db = req.db;
    const memesCollection = db.collection('memes');

    // Retrieve memes from the database for the current author
    memesCollection
        .find({ author }, {
            sort: { createdAt: -1 },
            skip: page * limit,
            limit: limit
        })
        .then((memesDB) => {
            // Get the total count of memes for the current author
            total = memes.filter(meme => meme.author === author).length;
            results.total = total;

            // Update results array with memes from the database
            results.results = memes
                .filter(meme => meme.author === author)
                .slice(startIndex, endIndex);
            // Send the results as JSON:)
            res.status(200).json(results);
        })
        .catch((e) => {
            res.status(500).json({ error: 'Could not fetch the memes' });
        });
});

module.exports = router;