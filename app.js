require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/googleAuth");

const authRoutes = require("./routes/authRoutes");
const letterRoutes = require("./routes/letterRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/auth", authRoutes);
app.use("/letters", letterRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
