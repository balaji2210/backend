const jwt = require("jsonwebtoken");

module.exports.jwtVerify = (token = null, secret = null) => {
  try {
    let decoded = null;
    if (token && token !== "null") {
      if (secret) {
        decoded = jwt.verify(token, secret);
      } else {
        decoded = jwt.verify(token, process.env.SECRET);
      }
    }
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};
