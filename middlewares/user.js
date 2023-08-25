const { catchHandler, errorHandler } = require("../utilities/handler");
const { jwtVerify } = require("../utilities/jwtVerify");

module.exports.checkUserAuth = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token ||
      req?.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        message: "Access Denied",
      });
    }
    const decoded = jwtVerify(token, process.env.SECRET);

    req.userId = decoded?._id;
    next();
  } catch (error) {
    console.log(">>", error);
    return catchHandler(res, res, error);
  }
};
