import mongoose, { isValidObjectId, Schema } from "mongoose";

import { IEvents } from "../interfaces/IEvents";


export interface IEventsModel extends IEvents, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
}

const EventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: String, required: true },
		categories: { type: Array },
		location: { type: Schema.Types.ObjectId, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IEventsModel>("Event", EventSchema);
