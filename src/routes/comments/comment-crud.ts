import { FastifyRequest, FastifyReply } from "fastify";
import {} from "http";
import Comment from "../../models/comment.model";
import Event from "../../models/event.model";
import { errorBuilder, responseBuilder } from "../../utils/builders";
import Locals from "../../infrastructure/providers/Locals";
import { Schema } from "mongoose";

export class CreateComment {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { message, eventId } = req.body;
      const { _id: userId } = req.userDetails;

			const commentDB = new Comment({
				message,
        eventId,
        userId
			});
			await commentDB.save();
			rep.code(201);
			return responseBuilder(commentDB._id);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class UpdateComment {
	public static async perform(
		req: FastifyRequest<{ Params: { commentId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { message } = req.body;
      const { _id: userId } = req.userDetails;
			const { commentId } = req.params;

			const foundComment = await Comment.findOne({ _id: commentId, userId });

			if (!foundComment) {
				rep.code(404);
				return errorBuilder("Not Found!");
			}

			foundComment.message = message;

			await foundComment.save();

			rep.code(201);
			return responseBuilder("updated");
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class GetEventComments {
	public static async perform(
		req: FastifyRequest<{ Params: { eventId: string }; }>,
		rep: FastifyReply
	): Promise<any> {
		try {
      const { eventId } = req.params;

			const commentList = await Comment.find({ eventId });

			rep.code(200);
			return responseBuilder(commentList);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class DeleteComment {
	public static async perform(
		req: FastifyRequest<{ Params: { commentId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { commentId } = req.params;

			const removedListResult = await Comment.remove({ _id: commentId });

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
