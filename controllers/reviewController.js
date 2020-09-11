const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.checkTourIDAndUserID = (req, res, next) => {
  // Checks if the tour ID and User ID was explicitly specified and if it wasn't
  // sets them if it handler function was called from a nested route
  if (!req.body.tour) {
    req.body.tour = req.params.tourID;
  }

  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
