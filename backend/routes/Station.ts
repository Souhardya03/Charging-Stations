import express from "express";
import {
	createStation,
	deleteStationById,
	getAllStations,
	getStationsByUserId,
	updateStationById,
} from "../controllers/Station";
import { auth } from "../middlewares/auth";
const router = express.Router();

router.route("/create").post(auth, createStation);
router.route("/").get(auth,getAllStations);
router.route("/user").get(auth, getStationsByUserId);
router.route("/delete/:id").delete(auth, deleteStationById);
router.route("/update/:id").patch(auth, updateStationById);

export default router;
