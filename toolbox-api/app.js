const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes');
const apiRouter = require('./routes/api_rest')
const fileList = require('./routes/get_list')

const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/files/data', apiRouter);
app.use('/files/list', fileList)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  let locals = res
  locals.message = err.message;
  locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  locals.status(err.status || 500);
  locals.render('error');
});

module.exports = app;
