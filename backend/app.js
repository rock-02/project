const express = require("express");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
module.exports = app;
