import { FastifyRequest, FastifyReply } from "fastify";
import {} from "http";
import Location from "../../models/location.model";
import Event from "../../models/event.model";
import { errorBuilder, responseBuilder } from "../../utils/builders";
import Locals from "../../infrastructure/providers/Locals";
import { Schema } from "mongoose";

export class CreateLocation {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { name } = req.body;

			const locationDB = new Location({
				name,
			});
			await locationDB.save();
			rep.code(201);
			return responseBuilder(locationDB._id);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class UpdateLocation {
	public static async perform(
		req: FastifyRequest<{ Params: { locationId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { name } = req.body;
			const { locationId } = req.params;

			const foundLocation = await Location.findOne({ _id: locationId });

			if (!foundLocation) {
				rep.code(404);
				return errorBuilder("Not Found!");
			}

			foundLocation.name = name;

			await foundLocation.save();

			rep.code(201);
			return responseBuilder("updated");
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class GetLocations {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const locationList = await Location.find({});

			const locationIds = locationList.map((location) => {
				return location._id;
			});

			const locationEvents = await Event.find({
				locationId: { $in: locationIds },
			});

			const locationWiseEventStats = locationEvents.reduce(
				(locationWiseCount, currentEvent) => {
					const locationId = currentEvent.location.toString();
					if (locationWiseCount[locationId]) {
						locationWiseCount[locationId] += 1;
					} else {
						locationWiseCount[locationId] = 1;
					}

					return locationWiseCount;
				},
				{}
			);

			const updatedLocationList = locationList.map((currentLocation) => {
				const locationJson = currentLocation.toJSON();
				delete locationJson.__v;
				const locationId = locationJson._id.toString();
				return {
					...locationJson,
					eventCount: locationWiseEventStats[locationId] || 0,
				};
			});

			rep.code(200);
			return responseBuilder(updatedLocationList);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class DeleteLocation {
	public static async perform(
		req: FastifyRequest<{ Params: { locationId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { locationId } = req.params;

			const locationEvents = await Event.find({
				location: locationId,
			});

      if(locationEvents.length) {
        rep.code(422);
				return errorBuilder("Location exist in event");
      }

			const removedListResult = await Location.remove({ _id: locationId });

			if (!removedListResult.deletedCount) {
				rep.code(404);
				return errorBuilder("Not Found!");
			}

			rep.code(200);
			return responseBuilder("Deleted");
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}
