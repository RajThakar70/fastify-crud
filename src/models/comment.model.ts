import mongoose, { isValidObjectId, Schema } from "mongoose";

import { IComments } from "../interfaces/IComments";


export interface ICommentsModel extends IComments, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
	{
		message: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, required: true },
		eventId: { type: Schema.Types.ObjectId, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<ICommentsModel>("Comment", CommentSchema);
