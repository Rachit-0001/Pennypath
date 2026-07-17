require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas, then start the HTTP server.
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`PennyPath API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Gracefully handle unhandled promise rejections instead of crashing silently
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
