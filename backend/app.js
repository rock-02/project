const express = require("express");
const userRouter = require("./routers/userRouter");
const errorMiddleware = require("./middlewares/error.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/user", userRouter);

app.use(errorMiddleware);

module.exports = app;
