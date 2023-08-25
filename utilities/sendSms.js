// const client = require("twilio")(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_TOKEN
// );

const axios = require("axios");

module.exports.sendSMS = async (phone = "", message = "") => {
  try {
    if (process.env.NODE_ENV !== "production") return true;
    await axios.get(`
      https://www.fast2sms.com/dev/bulkV2?authorization=${
        process.env.KEY
      }&variables_values=${message}&route=otp&numbers=${phone?.toString()}`);
  } catch (error) {
    console.log(">>", error);
  }
};
