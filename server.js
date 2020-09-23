const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// We can handle uncaught exceptions globally by using events and events listener
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!! Shuting Down!!');
  console.log(err.name, err.message);
  process.exit();
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(
    DB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  )
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});

// We Can use Events and Events Listener to globally handle every unhandled promise rejections

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down....');
  server.close(() => {
    process.exit(1);
  });
});

// Responds to SIGTERM signals and gracefully shutdown the application

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. SHUTTING DOWN GRACEFULLY!!');
  server.close(() => {
    console.log('Process terminated!!');
  });
});
