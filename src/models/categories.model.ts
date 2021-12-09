import mongoose, { isValidObjectId, Schema } from "mongoose";

import { ICategories } from "../interfaces/ICategories";


export interface ICategoriesModel extends ICategories, mongoose.Document {
	createdAt: Date;
	updatedAt: Date;
}

const CategoriesSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<ICategoriesModel>("Categories", CategoriesSchema);
