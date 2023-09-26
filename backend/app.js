const express = require("express");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const isLoggedIn = require("./middlewares/isloggedIn");
const fileUpload = require("express-fileupload");
const commentRouter = require("./routers/commentRouter");
const { errorMiddleware } = require("./middlewares/error");
const cors = require("cors");
require("express-async-errors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use();
app.use(cors());

app.use("/api/v1/user", userRouter);
// app.use('/api/v1/auth', userRouter);
// app.use('/api/v1/user', userRouter);
app.use("/api/v1/post", isLoggedIn, postRouter);
app.use("/api/v1/comment", isLoggedIn, commentRouter);

app.use(errorMiddleware);

app.use(errorMiddleware);
module.exports = app;
