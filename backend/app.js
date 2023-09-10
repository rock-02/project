const express = require('express');
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const isLoggedIn = require('./middlewares/isloggedIn');
require('express-async-errors');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/user', isLoggedIn, userRouter);
app.use('/api/v1/post', isLoggedIn, postRouter);

app.use(errorHandlerMiddleware);
module.exports = app;
