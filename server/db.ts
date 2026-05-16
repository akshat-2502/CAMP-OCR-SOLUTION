import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://khulbeakshat_db_user:6BThot7EBzpruKxI@cluster0.2ltscyf.mongodb.net/pharma_app?appName=Cluster0";

declare global {
  var __mongooseClientPromise: Promise<typeof mongoose> | undefined;
}

const connectDB = async () => {
  if (!globalThis.__mongooseClientPromise) {
    globalThis.__mongooseClientPromise = mongoose.connect(MONGODB_URI).then(() => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }
  return globalThis.__mongooseClientPromise;
};

export default connectDB;
