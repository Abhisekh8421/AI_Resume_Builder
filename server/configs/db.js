import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    let mongodbURI = process.env.MONGODB_URL;
    const projectName = "Resume-builder";
    if (!mongodbURI) {
      throw new Error("Mongodb_URI environment variable not set");
    }
    if (mongodbURI.endsWith("/")) {
      mongodbURI = mongodbURI.slice(0, -1);
    }
    await mongoose.connect(`${mongodbURI}/${projectName}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
