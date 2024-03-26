import {withMiddlewares} from "@/util/middleware";
import {DeleteUserParams, GetUserParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	DeleteUserServerValidator,
	GetUserParamsServerValidator,
	matchUserOrgWithParamsOrg,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetUserByIdResponse} from "@/util/api/api_responses";
import {UserType} from "@prisma/client";

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


export const DELETE = withMiddlewares<DeleteUserParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Administrator],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["userId", "orgId"]),
	validateURLParams(DeleteUserServerValidator),
	async (req, res) => {
		const {orgId, userId} = req.params
		await db.user.delete({
			where: {
				userId: userId,
				userOrgId: orgId
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)