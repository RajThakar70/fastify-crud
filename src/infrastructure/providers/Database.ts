import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import Locals from './Locals';

export default class Database {
	// Initialize your database pool
	public static async init (): Promise<any> {
		const dsn = Locals.config().mongooseUrl;
		const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

		try {
			await mongoose.connect(dsn, options);
			console.log('connected to mongo server at: ' + dsn);
		} catch (error) {
			console.log('Failed to connect to the Mongo server!!');
			console.log(error);
			throw error;
		}
	}
}