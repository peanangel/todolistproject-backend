const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const indexRouter = require('./api/rounts/index');
const todolistRouter = require('./api/rounts/user');


app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/todolist', todolistRouter);


module.exports = app;