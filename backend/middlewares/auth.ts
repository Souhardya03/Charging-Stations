import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
export const auth = asyncHandler(
	(req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.cookie?.split("=")[1]|| req.headers.authorization?.split(" ")[1];	

		if (!token) {
			res.status(401).json({ message: "Unauthorized user" });
			return;
		}
		jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
			if (err) {
				res.status(403).json({ message: "Invalid or expired token" });
				res.clearCookie("token");
				return;
			}
			(req as any).user = decoded;			
			next();
		});
	}
);
