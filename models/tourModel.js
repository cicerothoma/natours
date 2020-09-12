const slugify = require('./../utils/slug');
// const User = require('./userModel');
const mongoose = require('mongoose');

// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must Have A Name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A Tour Must Have A Duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour Must Have A Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour Must Have A Difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A Tour Must Have A Price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this keyword points to the currently processed document and it only
          // works when creating a new document
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) Must Always Be Below Regular Price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A Tour Summary Is Required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour Must Have A Cover Image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // This line of code is used to hide sensitive data from the user so that it is never exposed
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON to specify geospatial(location) data
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Type of Geospatial data should only be point',
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
            message: 'Type of Geospatial data should only be point',
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: [Array], // Using Embedding, this is how it would works

    // adding tour-guides by referencing them instead of embedding them
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Creating an Index to improve Read Performance
// tourSchema.index({ price: 1 }); || Single Field Index
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Compound index
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// How to create virtual data that is not stored in the database but it appears on every query
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// This is how to use virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middleware: Runs before the actual document is saved to database
// The "this" keyword for document middlewares refers to the currently processed document
tourSchema.pre(
  'save',
  function (next) {
    this.slug = slugify(this.name);
    next();
  },
  function (err) {
    console.log(err);
  }
);

// The Code below demonstrates how to embed data from other(user) collection using a pre-save hook or document middleware
// And it only works for creating new documents and won't work for updating the user fields in the user collections

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => {
//     return await User.findById(id);
//   });
//   console.log(guidesPromises);

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will Save Document...');
//   next();
// });

// Document Middleware: Runs after the document is saved to the database
// tourSchema.post('save', function (doc, next) {
//   console.log('Document Saved To Database Successfully', doc);
//   next();
// });

// Query Middleware: Running a pre-find() hook
// The "this" keyword for document middlewares refers to the currently processed query object
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
    // model: 'User', // This option is not important because we already specified the Collection we are referencing in the model
  });
  next();
});

// Aggregation Middleware: Runs for every aggregation pipeline
// The "this" keyword for document middlewares refers to the currently processed aggregation object
// tourSchema.pre('aggregate', function (next, docs) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
