import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI  = process.env.MONGO_URL;
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
};

export {
    connectDB
}