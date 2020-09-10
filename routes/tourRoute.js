const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoute');
const express = require('express');

const router = express.Router();

// Param MiddleWare
// router.param('id', tourController.checkID);

// The Route Below is a nested route

// router // Bad Practice to implement nested route
//   .route('/:tourID/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// Best Practice: Implementing Nested Route
router.use('/:tourID/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.topCheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStat);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

// Implementing a nested route
