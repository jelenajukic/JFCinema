require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");

// ensure login
const ensureLogin = require('connect-ensure-login');
// moment (dates / times)
const moment = require('moment');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();



// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

// format dates in handlebars
hbs.registerHelper('formatDate', function (dateString) {
  return new hbs.SafeString(
    moment(dateString).format("ddd MMM D")//.toUpperCase()
  );
});

// format dates in handlebars (with years)
hbs.registerHelper('formatDateYear', function (dateString) {
  return new hbs.SafeString(
    moment(dateString).format("ddd MMM D, YYYY")//.toUpperCase()
  );
});

// truncate text
hbs.registerHelper('truncate', function (str, len) {
  if (str.length > len && str.length > 0) {
    var new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(" "));
    new_str = (new_str.length > 0) ? new_str : str.substr(0, len);

    return new hbs.SafeString(new_str + '...');
  }
  return str;
});

// default value for title local
app.locals.title = 'JFCinema - Only the best movies';


// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))
app.use(flash());
require('./passport')(app);


const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// movie (user)
const movieRoute = require('./routes/movie');
app.use('/movie', movieRoute);

// cinema (user)
const cinemaRoute = require('./routes/cinema');
app.use('/cinema', cinemaRoute);

// screening (user)
const screeningRoute = require('./routes/screening');
app.use('/screening', screeningRoute);

// user profile route (logged in user)
const profileRoute = require('./routes/profile');
app.use('/profile',
  ensureLogin.ensureLoggedIn('/auth/login'), // not logged in? go to login page.
  profileRoute); // else go to profile route

const adminRoute = require('./routes/admin');
app.use('/admin',
  ensureLogin.ensureLoggedIn('/auth/admin-login'),
  adminRoute);

const ticketsRoute = require('./routes/tickets');
app.use('/tickets',
  ensureLogin.ensureLoggedIn('/auth/login'),
  ticketsRoute);

module.exports = app;