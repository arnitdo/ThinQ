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
import {GetLecturesResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<OrgIdBaseParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student"], matchUserOrganization: matchUserOrgWithParamsOrg}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const lectures = await db.lecture.findMany({
			where: {
				lectureClassroom : {
					classroomOrgId: req.params.orgId,
					classroomEnrollments: {
						some : {
							userId: req.user!.userId
						}
					}
				}
			},
            orderBy:{
                lectureStartTimestamp: 'asc'
            }
		})
		res.status(200).json<GetLecturesResponse>({
			responseStatus: "SUCCESS",
			lectures: lectures
		})
	}
)