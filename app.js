require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const membersRouter = require('./routes/members');
const contributionsRouter = require('./routes/contributions');
const loanRouter = require('./routes/loans');

const app = express();
mongoose.connect('mongodb://favouroked:abc123@ds153314.mlab.com:53314/majemu');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/members', membersRouter);
app.use('/contributions', contributionsRouter);
app.use('/loans', loanRouter);

module.exports = app;
