import mongoose, { isValidObjectId, Schema } from 'mongoose';

import { IUser } from '../interfaces/IUser';


export interface IUsersModel extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    permission: { type: Array, required: true },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUsersModel>('User', UserSchema);
