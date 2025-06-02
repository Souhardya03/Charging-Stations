import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
export const registerUser = async (req: any, res: any) => {
	try {
		const { email, password, name } = req.body;
		if (!email || !password || !name) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists
		const isExist = await User.findOne({ email });
		if (isExist) {
			return res.status(400).json({ message: "User already exists" });
		}
		// Create new user
		const newUser = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, 10),
		});
		if (!newUser) {
			return res.status(500).json({ message: "User registration failed" });
		}

		return res.status(201).json({ message: "Registered successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

//Login user
export const loginUser = asyncHandler(async (req: any, res: any) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// Generate JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/",
			domain: "charging-stations-itp3.vercel.app",
			maxAge: 3600000,
		});

		return res.status(200).json({ message: "Login successful", token });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
});

export const logoutUser = asyncHandler(async (req: any, res: any) => {
	try {
		// Clear the cookie
		res.clearCookie("token", {
			// httpOnly: true,
			// secure: false, // Set to true if using HTTPS
			// sameSite: "none", // Adjust based on your requirements
		});
		return res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
});
