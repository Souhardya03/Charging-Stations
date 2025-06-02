import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import UserRouter from "./routes/User";
import StationRouter from "./routes/Station";

// Middleware
app.use(cors({
		origin: [
			process.env.FORNTEND_URI_DEV as string,
			process.env.FORNTEND_URI_PROD as string,
		],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	}));
app.use(express.json());

// Routes
app.use("/v1/api", UserRouter);
app.use("/v1/api/station", StationRouter);
app.get("/", (req: Request, res: Response) => {
	res.send("Hello from Express Server!");
});

// Database connection

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Database connection failed:", error);
		process.exit(1);
	});
