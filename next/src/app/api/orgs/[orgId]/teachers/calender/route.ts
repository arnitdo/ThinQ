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
import {GetCalenderResponse, GetClassroomsResponse, GetLecturesResponse, GetUserResponse, GetUsersResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<OrgIdBaseParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const lectures = await db.lecture.findMany({
			where: {
				lectureClassroom : {
                    facultyUserId: req.user!.userId,
                    classroomOrgId: req.params.orgId,
                }
			},
            orderBy:{
                lectureStartTimestamp: 'asc'
            },
			select: {
				lectureId: true,
				title: true,
				lectureStartTimestamp: true,
				lectureEndTimestamp: true,
				lectureClassroom: {
					select: {
						classroomId: true,
						classroomName: true,
						facultyUserId: true,
						User:{
							select:{
								userDisplayName: true
							}
						},
						_count: {
							select:{
								classroomEnrollments: true
							}
						}
					}
			
			}
			}
		})
		res.status(200).json<GetCalenderResponse>({
			responseStatus: "SUCCESS",
			lectures: lectures
		})
	}
)