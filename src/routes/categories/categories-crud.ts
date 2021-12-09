import { FastifyRequest, FastifyReply } from "fastify";
import {} from "http";
import Categories from "../../models/categories.model";
import Event from "../../models/event.model";
import { errorBuilder, responseBuilder } from "../../utils/builders";
import Locals from "../../infrastructure/providers/Locals";

export class CreateCategory {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { name } = req.body;

			const CategoriesDB = new Categories({
				name
			});

			await CategoriesDB.save();

			rep.code(201);
			return responseBuilder(CategoriesDB._id);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class UpdateCategory {
	public static async perform(
		req: FastifyRequest<{ Params: { categoryId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { name } = req.body;
			const { categoryId } = req.params;

			const foundCategories = await Categories.findOne({ _id: categoryId });

      if(!foundCategories) {
        rep.code(404);
			  return errorBuilder("Not Found!");
      }

			foundCategories.name = name;

			await foundCategories.save();

			rep.code(201);
			return responseBuilder("updated");
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class GetCategories {
	public static async perform(
		req: FastifyRequest<{ Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const categoriesList = await Categories.find({});

      const categoryIds = categoriesList.map((categories) => {
        return categories._id
      })

      const categoriesEvents = await Event.find({ categories: { $in: categoryIds }});

      const categoriesWiseEventStats = categoriesEvents.reduce((categoriesWiseCount, currentEvent) => {
        const categoryId = currentEvent.categories.toString();
        if(categoriesWiseCount[categoryId]) {
          categoriesWiseCount[categoryId] += 1;
        } else {
          categoriesWiseCount[categoryId] = 1;
        }

        return categoriesWiseCount;
      }, {});

      const updatedCategoriesList = categoriesList.map((currentCategories) => {
        const categoryJson = currentCategories.toJSON();
        delete categoryJson.__v;
        const categoryId = categoryJson._id.toString();
        return {
          ...categoryJson,
          eventCount: categoriesWiseEventStats[categoryId] || 0
        }
      })

			rep.code(200);
			return responseBuilder(updatedCategoriesList);
		} catch (err) {
			rep.code(500);
			return err;
		}
	}
}

export class DeleteCategory {
	public static async perform(
		req: FastifyRequest<{ Params: { categoryId: string }; Body: any }>,
		rep: FastifyReply
	): Promise<any> {
		try {
			const { categoryId } = req.params;

			const removedListResult = await Categories.remove({ _id: categoryId });

      if(!removedListResult.deletedCount) {
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
