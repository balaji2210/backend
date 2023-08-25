const joi = require("joi");
const { userSchema } = require("../models/user");
const {
  responseHandler,
  errorHandler,
  catchHandler,
} = require("../utilities/handler");

const jwt = require("jsonwebtoken");
const { jwtVerify } = require("../utilities/jwtVerify");

const { sendSMS } = require("../utilities/sendSms");

module.exports.createUser = async (req, res) => {
  try {
    const schema = joi.object().keys({
      phone: joi.number().min(10).required(),
    });
    await schema.validateAsync(req.body);

    const { phone } = req.body;

    const userFound = await userSchema.findOne({
      phone,
    });

    if (userFound) {
      let OTP = Math.round(Math.random() * 1000);
      if (OTP < 1000) OTP += 1000;
      const update = { otp: OTP, otpSaveTimeStamp: new Date().getTime() };
      await userSchema.findByIdAndUpdate(userFound?._id, update, {
        new: true,
      });

      await sendSMS(phone, `${OTP}`);

      return responseHandler(res, "User", userFound);
    }

    const user = await userSchema.create({
      phone,
    });

    if (user) {
      let OTP = Math.round(Math.random() * 1000);
      if (OTP < 1000) OTP += 1000;
      const update = { otp: OTP, otpSaveTimeStamp: new Date().getTime() };
      await userSchema.findByIdAndUpdate(user?._id, update, {
        new: true,
      });
      await sendSMS(phone, `${OTP}`);
      return responseHandler(res, "User", user);
    }
    return errorHandler(res, "Failed", 400);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const schema = joi.object().keys({
      phone: joi.number().min(10).required(),
      otp: joi.number().min(4).required(),
    });

    const { phone, otp } = req.body;

    const user = await userSchema.findOne({
      phone,
      otp,
    });

    if (!user) {
      return errorHandler(res, "Invalid Request", 400);
    }

    const update = {
      otp: null,
      otpSaveTimeStamp: null,
      isVerified: true,
    };

    await userSchema.findByIdAndUpdate(user?._id, update, {
      new: true,
    });

    const token = jwt.sign(
      {
        _id: user?._id,
      },
      process.env.SECRET
    );

    res.cookie("token", token);

    return responseHandler(res, "Verification Success", {
      success: true,
      token,
    });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.resendOTP = async (req, res) => {
  try {
    const schema = joi.object().keys({
      phone: joi.number().min(10).required(),
    });
    await schema.validateAsync(req.body);

    const { phone } = req.body;

    const user = await userSchema.findOne({
      phone,
    });

    if (user) {
      let OTP = Math.round(Math.random() * 1000);
      if (OTP < 1000) OTP += 1000;
      const update = { otp: OTP, otpSaveTimeStamp: new Date().getTime() };
      await userSchema.findByIdAndUpdate(user?._id, update, {
        new: true,
      });

      await sendSMS(phone, `${OTP}`);

      return responseHandler(res, "OTP Resent", user);
    }
    return errorHandler(res, "Invalid User", 400);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.checkAuth = async (req, res) => {
  try {
    let token =
      req?.cookies?.token ||
      req?.headers["x-access-token"] ||
      req?.query?.token;

    let decoded = null;
    try {
      decoded = jwtVerify(token, process.env.SECRET);
    } catch (error) {
      return errorHandler(res, "Failed to authenticate token", 401);
    }

    if (decoded) {
      req.userId = decoded?._id;
      const userId = decoded?._id;
      const user = await userSchema.findById(userId);
      return responseHandler(res, "User Details", user);
    }
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const userId = req?.userId;

    const user = await userSchema.findOne({
      _id: userId,
    });

    if (!user) {
      return errorHandler(res, "No User Details", 400);
    }
    return responseHandler(res, "User Details", user);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.updateUserDetails = async (req, res) => {
  try {
    const schema = joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().required(),
      mobile: joi.number().required(),
      grade: joi.number().required(),
      board: joi.string().required(),
      medium: joi.string().required(),
      school: joi.string().allow("", null),
      country: joi.string().required(),
      state: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const userId = req.userId;

    let user = await userSchema.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "No User Found",
      });
    }

    user = await userSchema.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    return responseHandler(res, "User Details Updated", {
      success: true,
    });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
