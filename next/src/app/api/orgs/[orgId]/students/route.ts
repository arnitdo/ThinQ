import {withMiddlewares} from "@/util/middleware";
import {GetOrgUsersParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	BaseOrgIdParamServerValidator,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetUsersResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<GetOrgUsersParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const users = await db.user.findMany({
			where:{
				userOrgId: req.params.orgId,
				userType: "Student",
			}
		})
		res.status(200).json<GetUsersResponse>({
			responseStatus: "SUCCESS",
			users: users
		})
	}
)