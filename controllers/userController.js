const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update User document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Get User and update
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  // 2) send response to user
  res.status(204).json({
    status: 'success',
    message: 'Your account has been succesfully deleted!',
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    requestedAt: req.requestTime,
    message: 'This Route Is Not Yet defined',
  });
};

exports.createUser = factory.createOne(User); // Although this is not needed because of the sign-up function in the authController file
// Do not attempt to change user password with this!!!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
