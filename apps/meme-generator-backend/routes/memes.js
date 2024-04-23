var express = require("express");
var router = express.Router();
require("dotenv").config();
const Meme = require("../models/Meme.js");
const upload = require("../middleware/multer");
const verifyAuthor = require("../middleware/verifyAuthor");
const fs = require("fs");
const sharp = require("sharp"); //for resizing


//const imageZipper = require("../tools/imageZipper");

async function resizeImage(buffer, targetSize) {
  // Use 'sharp' to resize the image
  const resizedBuffer = await sharp(buffer)
    .resize({
      fit: "inside",
      width: targetSize.width,
      height: targetSize.height,
    })
    .toBuffer();

  return resizedBuffer;
}

/**
 * @swagger
 * /memes:
 *   get:
 *     tags:
 *       - Memes
 *     summary: Get a list of memes
 *     description: Retrieve memes with pagination and optional filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author name
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Filter by keyword in title, author, or description
 *       - in: query
 *         name: creationDateBefore
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by memes created before this date (ISO 8601 format)
 *       - in: query
 *         name: creationDateAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by memes created after this date (ISO 8601 format)
 *       - in: query
 *         name: votes
 *         schema:
 *           type: integer
 *         description: Filter by number of votes (likes)
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         description: Sort memes by creation date (ascending or descending) or by number of votes (likes)
 *         enum: [creationDateDesc, creationDateAsc, votesDesc, votesAsc]
 *         default: creationDateDesc
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of memes matching the query
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meme'
 *                 prev:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Previous page number
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *                   description: Previous page information
 *                 next:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Next page number
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *                   description: Next page information
 *       '500':
 *         description: Error response
 */
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const author = req.query.author || null;
  console.log(req.query);
  const sortedBy = req.query.sortedBy || "creationDateDesc";
  const keyword = req.query.keyword || "";
  const creationDateBefore = req.query.creationDateBefore || null;
  const creationDateAfter = req.query.creationDateAfter || null;
  const votes = req.query.votes || null;

  // Conditionally build the query
  const authorQuery = author ? { author } : {};
  const keywordQuery = keyword
    ? {
        $or: [
          { title: { $regex: keyword, $options: "i" } }, // Case-insensitive search in title
          { author: { $regex: keyword, $options: "i" } }, // Case-insensitive search in author
          { description: { $regex: keyword, $options: "i" } }, // Case-insensitive search in description
        ],
      }
    : {};
  const creationDateBeforeQuery = creationDateBefore
    ? { createdAt: { $lt: new Date(creationDateBefore) } }
    : {};
  const creationDateAfterQuery = creationDateAfter
    ? { createdAt: { $gt: new Date(creationDateAfter) } }
    : {};
  const votesQuery = votes ? { likesCount: parseInt(votes) } : {};
  let sortQuery;
  switch (sortedBy) {
    case "creationDateDesc":
      sortQuery = { createdAt: -1 };
      break;
    case "creationDateAsc":
      sortQuery = { createdAt: 1 };
      break;
    case "votesDesc":
      sortQuery = { likesCount: -1 };
      break;
    case "votesAsc":
      sortQuery = { likesCount: 1 };
      break;

    default:
      break;
  }

  console.log(page, limit);

  const results = {};

  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;

  const db = req.db;
  const memesCollection = db.collection("memes");

  try {
    const memesDB = await memesCollection.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $match: {
          ...authorQuery,
          ...keywordQuery,
          ...creationDateBeforeQuery,
          ...creationDateAfterQuery,
          ...votesQuery,
        },
      }, // Apply author filter
      { $sort: sortQuery }, // Apply sorting
      { $skip: page * limit }, // Apply pagination
      { $limit: limit },
    ]);

    const size = memesDB.length;
    results.total = size;
    results.results = memesDB;

    results.prev = null;
    if (startIndex > 0 && size > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }
    results.next = null;
    if (endIndex < size) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch the memes" });
  }
});

/**
 * @swagger
 *   /memes/upload:
 *     post:
 *       summary: Upload a meme
 *       tags: [Memes]
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                 memeObject:
 *                   type: string
 *                   description: JSON stringified object containing meme data
 *                   example: |
 *                     {
 *                       "title": "Hahahaha sooooo funny XDD",
 *                       "author": "Spongebob",
 *                       "description": "Mock description",
 *                       "textFields": [
 *                         {
 *                           "text": "What are thooooose",
 *                           "position": {
 *                             "x": 50,
 *                             "y": 50
 *                           },
 *                           "size": {
 *                             "width": 200,
 *                             "height": 100
 *                           },
 *                           "font": "Impact",
 *                           "color": "#ffffff",
 *                           "secondaryColor": "#000000",
 *                           "fontSize": 24,
 *                           "textEffect": "shadow",
 *                           "isCapitalized": true,
 *                           "isItalic": false,
 *                           "isBold": false
 *                         }
 *                       ],
 *                       "fileTargetSize": 2000000,
 *                       "publishMode": "public",
 *                       "fileType": "image",
 *                       "usedTemplates": "Finding Neverland"
 *                     }
 *       responses:
 *         '201':
 *           description: Meme created successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Meme created successfully
 *                 meme: Meme object
 *                 imageURL: /path/to/your/image.jpg
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               example:
 *                 error: Internal server error
 */
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const memeData = JSON.parse(req.body.memeObject);

    const newMeme = new Meme(
      memeData.name,
      req.file.path.replace(/\\/g, "/").replace("public/", ""),
      memeData.author,
      memeData.description,
      memeData.textAreas,
      memeData.size,
      memeData.targetFileSize,
      Meme.PublishState[memeData.publishMode.toUpperCase()], // Ensure correct access
      Meme.FileType[memeData.fileType.toUpperCase()], // Ensure correct access
      memeData.templateId
    );


    const db = req.db;
    const memes = db.get("memes");

    const createdMeme = await memes.insert(newMeme);
    const shareableURL = `${process.env.BACKEND_DOMAIN}/${createdMeme._id}`; 

    res
      .status(201)
      .json({ message: "Meme created successfully", meme: createdMeme, imageURL: shareableURL });
  } catch (error) {
    console.error("Error creating meme:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /memes/{id}:
 *  get:
 *    summary: Get meme by ID
 *    description: Retrieve a meme by its ID
 *    tags:
 *      - Memes
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: ID of the meme to retrieve
 *    responses:
 *      '200':
 *        description: Successful response with the meme
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: Unique ID of the meme
 *            title:
 *              type: string
 *              description: Title of the meme
 *            imageUrl:
 *              type: string
 *              description: URL to the image of the meme
 *      '404':
 *        description: Meme not found
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              description: Error message indicating meme not found
 *      '500':
 *        description: Internal server error
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              description: Error message indicating internal server error
 */

router.get("/:id", async (req, res) => {
  const db = req.db;
  var memes = db.get("memes");
  const { id } = req.params;

  try {
    const meme = await memes.findOne({ _id: id });

    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }
    res.status(200).json(meme);
  } catch (error) {
    console.error("Error fetching meme:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/:id', upload.single('image'), verifyAuthor, async (req, res) => {
  const memeId = req.params.id;
  const { title, description, textFields } = req.body; // Example fields that might be updated

  try {
    const updatedMeme = await Meme.findByIdAndUpdate(memeId, { title, description, textFields }, { new: true });
    if (!updatedMeme) {
      return res.status(404).send('Meme not found.');
    }

    res.json(updatedMeme);
  } catch (error) {
    console.error('Error updating meme:', error);
    res.status(500).send('Internal server error.');
  }
});


/**
 * @swagger
 * /memes/like:
 *   post:
 *     summary: Either add or remove a like to a meme
 *     tags:
 *       - Memes
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       404:
 *         description: Meme not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/like",
  upload.fields([{ name: "id" }, { name: "author" }]),
  async (req, res) => {
    try {
      const db = req.db;
      const memes = db.get("memes");
      let id = req.body.id;

      const meme = await memes.findOne({ _id: id });
      if (!meme) {
        return res.status(404).json({ error: "Meme not found" });
      }

      let author = req.body.author;
      if (!author) {
        return res.status(400).json({ error: "Author data not provided" });
      }

      const index = meme.likes.indexOf(author);
      let action = "";
      if (index !== -1) {
        // Removethe user to the likes array
        meme.likes.splice(index, 1);
        action = "removed";
      } else {
        // Add the user to the likes array
        action = "added";
        meme.likes.push(author);
      }

      // Save the updated meme back to the database
      await memes.update({ _id: id }, { $set: meme });

      res.status(200).json({ message: `Like ${action} successfully`, meme });
    } catch (error) {
      console.error("Error adding like:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /memes/addComment:
 *   post:
 *     summary: Add a comment to a meme
 *     tags:
 *       - Memes
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               comment:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       404:
 *         description: Template or image not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/addComment",
  upload.fields([{ name: "id" }, { name: "comment" }, { author: "author" }]),
  async (req, res) => {
    try {
      const db = req.db;
      const memes = db.get("memes");
      let id = req.body.id;

      // 65b3c4d6af803f66878987aa
      const meme = await memes.findOne({ _id: id });
      if (!meme) {
        return res.status(404).json({ error: "Image not found" });
      }

      let comment = req.body.comment;
      if (!comment) {
        return res.status(400).json({ error: "Comment data not provided" });
      }

      let author = req.body.author;
      if (!author) {
        return res.status(400).json({ error: "Author data not provided" });
      }

      // Create a new comment object
      let commentObject = {
        comment: comment,
        author: author,
      };

      // Update the meme with the new comment
      meme.comments.push(commentObject);

      // Save the updated meme back to the database
      await memes.update({ _id: id }, { $set: meme });

      res.status(200).json({ message: "Comment added successfully", meme });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
