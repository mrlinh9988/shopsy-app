const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routeHandler = require('./routes');
const logger = require('morgan');
const RedisStore = require('connect-redis')(session);
const userService = require('./services/userService');
const basketService = require('./services/basketService');
// const config = require('../server/config/index');
// const db = require('../db');
// const fs = require('fs');

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// var morgan = require('morgan')

// // create "middleware"
// var logger = morgan('combined')


module.exports = (config) => {
  const app = express();

  const basket = basketService(config.redis.client);

  // create a write stream (in append mode)
  // app.use(morgan('combined'));
  app.use(logger('dev'));

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.set('trust proxy', 1); // trust first proxy
  app.use(session({
    store: new RedisStore({
      port: config.redis.options.port,
      client: config.redis.client,
    }),
    secret: 'linh',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(express.static(path.join(__dirname, '../client')));
  app.get('/favicon.ico', (req, res) => {
    res.status(204);
  });
  app.get('/robots.txt', (req, res) => {
    res.status(204);
  });

  // Define 'global' template variables here
  app.use(async (req, res, next) => {
    // To show the application name on the page
    res.locals.applicationName = config.applicationName;

    // Set up flash messaging
    if (!req.session.messages) {
      req.session.messages = [];
    }
    res.locals.messages = req.session.messages;

    try {

      if (req.session.userId) {
        res.locals.currentUser = await userService.getOne(req.session.userId);

        // console.log('current user: ', res.locals.currentUser);
        const basketCotents = await basket.getAll(req.session.userId);
        let count = 0;

        if (basketCotents) {
          Object.keys(basketCotents).forEach(key => {
            count += parseInt(basketCotents[key]);
          });
          res.locals.basketCount = count;
        }
      }

    } catch (error) {
      return next(error);
    }

    return next();
  });

  app.use('/', routeHandler(config));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error(`Not Found (${req.url})`);
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  return app;
};
