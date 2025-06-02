import { Request, Response } from "express";
import Station from "../models/Station";
import { asyncHandler } from "../utils/asyncHandler";

export const createStation = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { name, latitude, longitude, status, powerOutput, connectorType } =
				req.body;
			if (
				!name ||
				!latitude ||
				!longitude ||
				!status ||
				!powerOutput ||
				!connectorType
			) {
				res.status(400).json({ error: "Name and location are required" });
				return;
			}

			// Assuming we have a Station model to interact with the database
			const newStation = await Station.create({
				name,
				latitude,
				longitude,
				status,
				powerOutput,
				connectorType,
				createdBy: (req as any).user.id,
			});
			res
				.status(201)
				.json({ message: "Station created successfully", station: newStation });
		} catch (error) {
			console.error("Error creating station:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

//get all stations
export const getAllStations = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const filter: any = {};
			const { status, connectorType, powerOutput } = req.query;			

			if (status) filter.status = status;
			if (connectorType) filter.connectorType = connectorType;
			if (powerOutput) filter.powerOutput = powerOutput;

			const stations = await Station.find(filter).populate("createdBy", "name email");
			res
				.status(200)
				.json({ message: "Stations fetched successfully", stations });
		} catch (error) {
			console.error("Error fetching stations:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

//get station by user id
export const getStationsByUserId = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const userId = (req as any).user.id;
			if (!userId) {
				res.status(400).json({ error: "User ID is required" });
				return;
			}
			const { status, connectorType, powerOutput } = req.query;

			const filter: any = { createdBy: userId };
			if (status) filter.status = status;
			if (connectorType) filter.connectorType = connectorType;
			if (powerOutput) filter.powerOutput = powerOutput;
			const stations = await Station.find(filter).populate(
				"createdBy",
				"name email"
			);
			res.status(200).json(stations);
		} catch (error) {
			console.error("Error fetching stations by user ID:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

//delete station by id
export const deleteStationById = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const stationId = req.params.id;
			console.log(stationId);
			
			const station = await Station.findByIdAndDelete(stationId);
			if (!station) {
				res.status(404).json({ error: "Station not found" });
				return;
			}
			res.status(200).json({ message: "Station deleted successfully" });
		} catch (error) {
			console.error("Error deleting station:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

//update station by id
export const updateStationById = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const stationId = req.params.id;
			const { name, latitude, longitude, status, powerOutput, connectorType } =
				req.body;

			const updatedStation = await Station.findByIdAndUpdate(
				stationId,
				{ name, latitude, longitude, status, powerOutput, connectorType },
				{ new: true }
			);

			if (!updatedStation) {
				res.status(404).json({ error: "Station not found" });
				return;
			}

			res.status(200).json({
				message: "Station updated successfully",
				station: updatedStation,
			});
		} catch (error) {
			console.error("Error updating station:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);
