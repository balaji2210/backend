const {
  createUser,
  verifyOTP,
  resendOTP,
  checkAuth,
  getUserDetails,
  updateUserDetails,
} = require("../controllers/user");
const { checkUserAuth } = require("../middlewares/user");

const router = require("express").Router();

router.post("/user", createUser);

router.post("/verify", verifyOTP);

router.post("/resend", resendOTP);

router.get("/checkAuth", checkAuth);

router.get("/getUser", checkUserAuth, getUserDetails);

router.post("/update", checkUserAuth, updateUserDetails);

module.exports = router;
