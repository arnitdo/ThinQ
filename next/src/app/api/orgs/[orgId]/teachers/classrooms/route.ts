import { withMiddlewares } from "@/util/middleware";
import { GetOrgUsersParams, OrgIdBaseParams } from "@/util/api/api_requests";
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
import { GetClassroomDataResponse, GetClassroomsResponse, GetUserResponse, GetUsersResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares<OrgIdBaseParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const classrooms = await db.classroom.findMany({
			where: {
				classroomOrgId: req.params.orgId,
				facultyUserId: req.user!.userId
			},

			select: {
				classroomId: true,
				classroomName: true,
				facultyUserId: true,
				classroomOrgId: true,
				_count: {
					select: { classroomEnrollments: true }

				},
				User: {
					select: {
						userId: true,
						userDisplayName: true,
					}
				}
			}
		})
		res.status(200).json<GetClassroomDataResponse>({
			responseStatus: "SUCCESS",
			classrooms: classrooms
		})
	}
)