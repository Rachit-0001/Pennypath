const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB Atlas using the connection string
 * provided in environment variables. Exits the process on failure since
 * the API cannot function without a database connection.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
