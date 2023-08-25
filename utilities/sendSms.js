const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

module.exports.sendSMS = async (phone = "", message = "") => {
  try {
    if (process.env.NODE_ENV !== "production") return true;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone?.toString()}`,
    });
  } catch (error) {
    console.log(">>", error);
  }
};
