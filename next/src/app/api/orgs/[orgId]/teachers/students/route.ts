import {withMiddlewares} from "@/util/middleware";
import {GetOrgUsersParams, OrgIdBaseParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	BaseOrgIdParamServerValidator, matchUserOrgWithParamsOrg,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetClassroomsResponse, GetUserResponse, GetUsersResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<OrgIdBaseParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const users = await db.user.findMany({
			where: {
				userOrgId: req.params.orgId,
				userClassrooms: {
					some:{
						enrolledClassroom: {
							facultyUserId: req.user!.userId
						}
					}
				
				}
			}
		})

		res.status(200).json<GetUsersResponse>({
			responseStatus: "SUCCESS",
			users: users
		})
	}
)