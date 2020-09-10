const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let reviews = null;
  if (req.params.tourID) {
    reviews = await Review.find({ tour: req.params.tourID });
  } else {
    reviews = await Review.find();
  }

  res.status(200).json({
    status: 'success',
    data: {
      results: reviews.length,
      reviews,
    },
  });
});

exports.checkTourIDAndUserID = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourID;
  }

  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
