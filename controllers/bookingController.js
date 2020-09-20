const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  if (!tour) {
    return next(new AppError(`Tour Not Found`, 404));
  }
  // 2) Create the checkout session
  const session = await stripe.checkout.sessions.create({
    // Information about session
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${tour._id}&user=${
      req.user._id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: `${req.user.email}`,
    client_reference_id: req.params.tourID,
    // Information about product
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // Temporary Solution || It's UNSECURE. Everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }

  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
