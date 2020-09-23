const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const bookingRouter = require('./routes/bookingRoute');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

// Start Express App
const app = express();

// Trusts Proxy (Important for Heroku to work properly)
app.enable('trust proxy');

// Sets Template Engine to render websites on the server
app.set('view engine', 'pug');
// Lets Express know the folder our views are located
app.set('views', path.join(__dirname, 'views'));
// 1) Global Middlewares
// This is how we use middleware (app.use)

// Implements CORS {CROSS ORIGIN REQUEST SHARING}
app.use(cors());

// The options is a http method like GET, POST, etc (Sent On a Pre Flight Phase)
app.options('*', cors());

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP Header (Helmet )
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// console.log(process.env.NODE_ENV);

// Use Mogan to log api request in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour!',
});

// Limit request from the same API
app.use('/api', limiter);

// Stripe Webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Body Parser (To parse body form the request that was made || Reading Request from the body || PUT, POST, PATCH requests)
app.use(express.json({ limit: '10kb' }));
// Form Parser (Parses data from an html form to the req.body)
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);
// Cookie Parser. (Parse cookie from request)
app.use(cookieParser());

// Data Sanitization against NOSQL Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Add Compression Middleware to compress all responses(HTML && JSON)
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 2) Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// 3) Catching Unhandled Routes

// My Solution
// const routes = ['/api/v1/tours', '/api/v1/users'];
// app.use((req, res, next) => {
//   if (routes.includes(req.url) === false) {
//     res.status(404).json({
//       status: 'fail',
//       message: `Can't find ${req.url} on this server`,
//     });
//   }
//   next();
// });

// The Instructors Solution

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  // The next function accepts an argument that we use as the error object
  next(err);
});

// Global Error Handling Middleware for Operational error

app.use(globalErrorHandler);

module.exports = app;
