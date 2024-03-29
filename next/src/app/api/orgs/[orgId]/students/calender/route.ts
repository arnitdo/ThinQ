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
import {GetCalenderResponse, GetLecturesResponse} from "@/util/api/api_responses";

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