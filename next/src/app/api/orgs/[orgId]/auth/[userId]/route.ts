import {withMiddlewares} from "@/util/middleware";
import {GetUserParams} from "@/util/api/api_requests";
import {
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	GetUserParamsServerValidator,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetUserByIdResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<GetUserParams>(
	requireURLParams(["orgId", "userId"]),
	validateURLParams(GetUserParamsServerValidator),
	async (req, res) => {
		const { orgId, userId } = req.params
		const user = await db.user.findFirst({
			where: {
				userId: userId
			}
		})

		res.status(200).json<GetUserByIdResponse>({
			responseStatus: "SUCCESS",
			user: user!
		})
	}
)
