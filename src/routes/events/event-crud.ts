import { FastifyRequest, FastifyReply } from "fastify";
import {} from "http";
import Event from "../../models/event.model";
import Comment from "../../models/comment.model";
import Location from "../../models/location.model";
import Categories from "../../models/categories.model";
import { errorBuilder, responseBuilder } from "../../utils/builders";
import Locals from "../../infrastructure/providers/Locals";
import User from "../../models/user.model";

export class CreateEvent {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { title, description, date, categories, location } = req.body;

			const eventDB = new Event({
				title,
				description,
				date,
				categories,
				location,
			});
			await eventDB.save();
			rep.code(201);
			return { id: eventDB._id };
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class UpdateEvent {
	public static async perform(
		req: FastifyRequest<{ Params: { eventId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { title, description, date, categories, location } = req.body;
			const { eventId } = req.params;

			const foundEvent = await Event.findOne({ _id: eventId });

			if (!foundEvent) {
				rep.code(404);
				return errorBuilder("Not Found!");
			}

			if (title) {
				foundEvent.title = title;
			}

			if (description) {
				foundEvent.description = description;
			}
			if (date) {
				foundEvent.date = date;
			}

			if (categories) {
				foundEvent.categories = categories;
			}

			if (location) {
				foundEvent.title = location;
			}

			await foundEvent.save();

			rep.code(201);
			return { message: { status: "updated" } };
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class GetEvents {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const eventList = await Event.find({});

			rep.code(200);
			return { message: { eventList } };
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class GetEvent {
	public static async perform(
		req: FastifyRequest<{ Params: { eventId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { eventId } = req.params;

			const foundEvent = await Event.findOne({ _id: eventId });

			if (!foundEvent) {
				rep.code(404);
				return errorBuilder("Not Found!");
			}

			const eventComments = await Comment.find({ eventId: eventId }).sort({
				createdAt: -1,
			});

			const eventLocation = await Location.findOne({
				_id: foundEvent.location,
			});

			let eventCategories = [];
			if (foundEvent.categories) {
				eventCategories = await Categories.find({
					_id: { $in: foundEvent.categories },
				});
			}

			eventCategories = eventCategories.map((categories) => {
				return categories.name;
			});

			const userIds = eventComments.map((comment) => {
				return comment.userId;
			});

			const users = await User.find({ _id: { $in: userIds } });

			const userIdToNameMap = users.reduce((map, currentUser) => {
				const userId = currentUser._id.toString();
				map[userId] = { name: currentUser.name, email: currentUser.email };
				return map;
			}, {});

			const commentWithUserName = eventComments.map((comment) => {
				const commentJson = comment.toJSON();
				const commentedUserId = commentJson.userId;

				return {
					message: commentJson.message,
					username: userIdToNameMap[commentedUserId].name,
					email: userIdToNameMap[commentedUserId].email,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
				};
			});

			rep.code(201);

			return responseBuilder({
				...foundEvent.toJSON(),
				comments: commentWithUserName,
				location: eventLocation.name,
				categories: eventCategories,
			});

		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class DeleteEvent {
	public static async perform(
		req: FastifyRequest<{ Params: { eventId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { eventId } = req.params;
			const removedComments = await Comment.deleteMany({ eventId });
			const removedListResult = await Event.deleteOne({ _id: eventId });

			if (!removedListResult.n) {
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
