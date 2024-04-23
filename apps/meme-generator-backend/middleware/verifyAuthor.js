const { ObjectId } = require("mongodb");

async function verifyAuthor(req, res, next) {
  const memeId = req.params.id;
  const userId = req.user.userId;

  if (!ObjectId.isValid(memeId) || !ObjectId.isValid(userId)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const db = req.db;
    const memes = db.get("memes");
    const meme = await memes.findOne({ _id: ObjectId(memeId) });
    const users = db.get("users");
    const user = await users.findOne({ _id: ObjectId(userId) });

    if (!meme) {
      return res.status(404).send("Meme not found.");
    }

    if (meme.author.toString() !== user.username.toString()) {
      return res
        .status(403)
        .send("You are not authorized to update this meme.");
    }

    req.meme = meme;
    next(); // User is authorized
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).send("Internal server error.");
  }
}

module.exports = verifyAuthor;
