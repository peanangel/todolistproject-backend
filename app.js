const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const indexRouter = require('./api/rounts/index');
const userRouter = require('./api/rounts/user');
const todolistRouter = require('./api/rounts/todolist');


app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/todolist', userRouter);
app.use('/todolist', todolistRouter);


module.exports = app;