import { Schema } from "mongoose";

export interface IEvents {
  title: string;
  description: string;
  date: string;
  categories?: Array<string>;
  location: string;
}