const mongoose = require('mongoose');
const Tour = require('./../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be below 1'],
      max: [5, 'Rating cannot be above 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Calculating the Average Rating Based On The Reviews Using Static Methods
// Static Methods can be called directly on the Model unlike Instance methods that are called on the document
reviewSchema.statics.calcAverageRatings = async function (tourID) {
  // In Static Methods the "this" keyword points to the current model, in the case (The Review Model)
  console.log(tourID);
  const stats = await this.aggregate([
    // The Aggregate method always returns a promise
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: '$tourID',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', function () {
  // Document Middleware
  // The "this" keyword points to the document that will be saved

  // To call the static method available on the model with the "this" keyword pointing to the
  // document, we can use the constructor object and it points to the model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // This is a query middleware and the "this" keyword in query middleware points
  // to the current query and not the document. To get access to the document we can execute a query

  this.reviewDocument = await this.findOne(); // This is a hack to pass data from a pre-hook to a post-hook
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); || This won't work for a post middleware because the query has already executed
  await this.reviewDocument.constructor.calcAverageRatings(
    this.reviewDocument.tour
  );
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
