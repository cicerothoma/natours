const Tour = require('./../models/tourModel');
const factory = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await Tour.findById(req.param.tourID);

  if (!tour) {
    return next(new AppError(`Tour Not Found`, 404));
  }
  // 2) Create the checkout session

  // 3) Create session as response
});
