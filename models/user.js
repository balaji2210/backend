const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 255,
      default: "anonuymus",
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 255,
      default: "anonuymus",
    },
    email: {
      type: String,
      default: null,
      trim: true,
      minLength: 6,
      maxLength: 255,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      required: true,
      minLength: 0,
      maxLength: 10,
      index: { unique: true },
    },
    userType: {
      type: String,
      default: "student",
    },
    otp: { type: Number, required: false, default: null },
    otpSaveTimeStamp: { type: Number, required: false, default: null },
    isVerified: { type: Boolean, default: false },
    NoOfLogins: { type: Number, default: 0 },
    grade: {
      type: Number,
      default: null,
    },
    board: {
      type: String,
      default: null,
    },
    medium: {
      type: String,
      default: null,
    },
    school: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

exports.userSchema = mongoose.model("users", userSchema);
