const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.local.alert =
      "Your Booking Was Successful. Please check your email for confirmation. \n If Your booking doesn'n show up here immediately, please come back later";
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get All Tours From The Database
  const tours = await Tour.find();
  // 2) Build Our Template
  // 3) Render the template using the tour data from step one
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'reviews',
    'review rating user'
  );
  if (!tour) {
    return next(
      new AppError(`Can't find tour with name: ${req.params.slug}`, 404)
    );
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user._id });

  // 2) Find tours with returned Id
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.profile = (req, res) => {
  res.status(200).render('profile', {
    title: 'Your Account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );

  res.status(200).render('profile', {
    title: 'You Account',
    user: updatedUser,
  });
});
