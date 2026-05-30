const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  // mongoose connection options are no longer required in recent versions,
  // but keeping minimal options for compatibility.
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
};

module.exports = { connectDB };
