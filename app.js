var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var csurf = require('csurf')

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // express 4.16之後 棄用


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// session
app.use(express.static("public"));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const expressValidator = require('express-validator');
// app.use(expressValidator());


// routes
var contact = require('./routes/contact');
var session = require('express-session');
// var flash = require('connect-flash');

app.use(session({
  secret: 'mysupercat',
  resave: true,
  saveUninitialized: true,
}))

// app.use(flash());

app.use('/contact', contact);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
