const njwt = require("njwt");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  if (
    req.headers.authorization == undefined ||
    req.headers.authorization == null
  ) {
    //console.error("Token verification error:", err);
    return res.status(401).json({ message: "No token provided" });
  }
  const token = req.headers.authorization.split(" ")[1];

  njwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = verifiedJwt.body;
    next();
  });
};

module.exports = authenticateToken;
