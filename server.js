require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const volleyball = require("volleyball");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(volleyball);
app.use(cors());
app.use(cookieParser());

mongoose.set("debug", process.env.NODE_ENV !== "production");

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((error) => console.log(error));

app.use("/", userRoutes);

app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is running`);
});
