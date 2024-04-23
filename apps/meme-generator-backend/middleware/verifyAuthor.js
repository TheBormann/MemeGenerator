async function verifyAuthor(req, res, next) {
    try {
      const memeId = req.params.id;
      const userId = req.user._id; // Assuming req.user is populated from your authentication strategy
  
      const meme = await Meme.findById(memeId);
      if (!meme) {
        return res.status(404).send('Meme not found.');
      }
  
      if (meme.author.toString() !== userId.toString()) {
        return res.status(403).send('You are not authorized to update this meme.');
      }
  
      next(); // User is authorized
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).send('Internal server error.');
    }
  }

  module.exports = verifyAuthor;