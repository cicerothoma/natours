const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
  console.log(tour);
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

exports.profile = (req, res) => {
  res.status(200).render('profile', {
    title: 'Your Account',
  });
};

exports.updateUserData = (req, res, next) => {
  console.log('UPDATING USER-DATA', req.body);
  next();
};
