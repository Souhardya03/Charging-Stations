import mongoose from "mongoose";
export const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI is not defined in environment variables");
	}
	try {
		await mongoose.connect(process.env.MONGO_URI as string);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection failed:", error);
		process.exit(1);
	}
};
