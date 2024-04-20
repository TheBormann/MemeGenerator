const { log } = require("console");
var express = require("express");
var router = express.Router();
const upload = require("../middleware/multer");
const Template = require("../models/Template.js");
const ObjectId = require("mongodb").ObjectId;

const validateID = (req, res, next) => {
  const { id } = req.params;
  if (id.length !== 24 || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get templates
 *     description: Retrieve templates based on author filter. The filter is an OR operator.
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: authors
 *         description: Filter by author(s) (['public'] is for all public)
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         default: ['public']
 *     responses:
 *       '200':
 *         description: Successful response with templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templates:
 *                   type: array
 *       '500':
 *         description: Internal server error
 *         schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              description: Error message indicating internal server error
 */
router.get("/", async (req, res) => {
  console.log(req.query);
  let { authors, public=true } = req.query;
  let query = {};

  query['isPublic'] = public;

  if (typeof authors === "string") {
    query['author'] = authors;
  } else if (Array.isArray(authors)) {
    query['author'] = { $in: authors };
  }

  const db = req.db;
  var templates = db.get("templates");

  try {
    const allTemplates = await templates.find(query);
    console.log(allTemplates); // Output the result to console for verification
    res.json({ templates: allTemplates });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /templates/{id}:
 *  get:
 *    summary: Get template by ID
 *    description: Retrieve a template by its ID
 *    tags:
 *      - Templates
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: ID of the template to retrieve
 *    responses:
 *      '200':
 *        description: Successful response with the template
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: Unique ID of the template
 *            name:
 *              type: string
 *              description: Name of the template
 *            isPublic:
 *              type: boolean
 *              description: Indicates if the template is public
 *            imagePath:
 *              type: string
 *              description: Path to the image of the template
 *      '404':
 *        description: Template not found
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              description: Error message indicating template not found
 *      '500':
 *        description: Internal server error
 *        schema:
 *          type: object
 *          properties:
 *            error:
 *              type: string
 *              description: Error message indicating internal server error
 */
router.get("/:id", validateID, async (req, res) => {
  const db = req.db;
  var templates = db.get("templates");
  const { id } = req.params;

  try {
    const template = await templates.findOne({ _id: id });

    if (!template) {
      return res.status(404).json({ error: "Template or image not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /templates/upload:
 *   post:
 *     summary: Uploads an image and creates a new template.
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: Template created successfully
 *       '500':
 *         description: Internal server error
 */

router.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const db = req.db;
  var templates = db.get("templates");
  try {
    const { name, author, isPublic } = req.body;
    const updatedPath = req.file.path
      .replace(/\\/g, "/")
      .replace("public/", "");
    const newTemplate = new Template(name, author, isPublic, updatedPath);
    const savedTemplate = await templates.insert(newTemplate);

    res.status(201).json({ template: savedTemplate, message: "Template created successfully" });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
