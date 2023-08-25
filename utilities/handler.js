module.exports.responseHandler = (res, message = "Success", data = null) => {
  res.status(200).json({ message, data });
};

module.exports.errorHandler = async (res, error = "", errorCode = 400) => {
  return res.status(Number(errorCode)).json({
    error: error,
  });
};

module.exports.catchHandler = async (res, req, error = "") => {
  const errorAPI = `${req.method}: ${req.originalUrl} ${
    req?.decoded?.user_id ? `(${req?.decoded?.user_id})` : ""
  }`;

  return res.status(500).json({
    errorName: error?.name,
    error,
    errorAPI,
  });
};
