const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send(`Unauthorized`);
    }

    const { userId, isAdmin } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    req.userId = userId;
    req.isAdmin = isAdmin;
    
    next();

  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};