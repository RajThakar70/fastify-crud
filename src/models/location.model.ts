import mongoose, { isValidObjectId, Schema } from "mongoose";

import { ILocation } from "../interfaces/ILocation";


export interface ILocationModel extends ILocation, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
}

const LocationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<ILocation>("Location", LocationSchema);
