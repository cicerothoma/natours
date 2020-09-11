const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const express = require('express');

const router = express.Router(); // This is like a mini-application || Middleware always run in sequence

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// (Remember that middleware always runs in sequence)
router.use(authController.protect); // This enforces authentication for any route that comes after this middleware

router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

// Only Administrators can access the routes below
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
