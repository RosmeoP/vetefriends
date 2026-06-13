import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI no está definido en las variables de entorno");
      process.exit(1);
    }    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected to database:", mongoose.connection.db.databaseName);
    setInterval(async () => {
      try {
        await mongoose.connection.db.command({ ping: 1 })
      } catch (_) {}
    }, 5 * 60 * 1000)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
