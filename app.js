var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors')

const responseBuilder = require('./response_builder')


var studentRouter = require('./routes/studentRoute');
var teacherRouter = require('./routes/teacherRoutes');
var indexRouter = require('./routes/index');

const MONGODB_URI =
  'mongodb+srv://cdevender:mongodb123%40@dev-af6ys.mongodb.net/test?retryWrites=true&w=majority';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use('/student',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/',indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(responseBuilder.build)

module.exports = app;
