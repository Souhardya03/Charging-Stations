import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
	name: String,
	longitude: Number,
	latitude: Number,
	status: { type: String, enum: ["Active", "Inactive"] },
	powerOutput: Number,
	connectorType: String,
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
const Station = mongoose.model("Station", stationSchema);
export default Station;
