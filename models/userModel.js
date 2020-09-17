const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Tell Us Your Name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please Provide Email'],
      lowercase: true,
      unique: [true, 'email already in use'],
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'guide', 'lead-guide', 'admin'],
        message:
          'User role must either be user or guide or lead-guide, or admin',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          // This custom validator will only work on save and not on update
          // It's important that you remember that
          return val === this.password;
        },
        message: 'Password and Confirm Password Field do not match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  // Document Middleware
  // Only run this function if password was modified
  if (this.isModified('password') === false) {
    return next();
  }

  // Encrypt password with bcrypt
  // Hash the password with cost of 12 (CPU Intensive) || The Higher the cost (12 in this case), the longer it takes to run
  this.password = await bcrypt.hash(this.password, 12);

  // We no longer need the confirmPassword field once validation is done so
  // there's no need saving it to the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // Document Middleware
  if (this.isModified('password') === false || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // Query Middleware
  // this points to current query
  this.find({ active: { $ne: false } });
  next();
});

// We create an instance method (A method that will be available on all document of a given colection || users collection in this case)
// To encrypt the password input when the user tries to login and compare the hashed result with the password hashed in the database
userSchema.methods.correctPassword = async function (
  // Instance Method
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // Instance Method
  if (this.passwordChangedAt) {
    // The Reason why we divide by 1000 is because the changedTimestamp is in milliseconds while
    // the JWTTimestamp is in seconds so we need to make sure they're both in th same format
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means the password has not been changed and True means it has been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Instance Method
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha512')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  // The calculation below is for adding 10 minutes to the time but converting the minutes into milliseconds
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
