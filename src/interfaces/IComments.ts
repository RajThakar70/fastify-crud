
import { Schema } from "mongoose";

export interface IComments{
  message: string;
  userId: string;
  eventId: string;
}