const mongoose = require("mongoose");
require("dotenv").config();

const connection = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const instance = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = instance.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
};

module.exports = { connectDB };
