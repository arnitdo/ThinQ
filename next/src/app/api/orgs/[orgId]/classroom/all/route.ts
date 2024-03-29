import {withMiddlewares} from "@/util/middleware";
import {OrgIdBaseParams} from "@/util/api/api_requests";
import {
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	BaseOrgIdParamServerValidator,
} from "@/util/validators/server";
import db from "@/util/db";
import {GetClassroomDataResponse, GetClassroomsResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<OrgIdBaseParams>(
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const { orgId } = req.params
		const classrooms = await db.classroom.findMany({
			where: {
				classroomOrgId: orgId
			},
            select:{
                classroomId: true,
                classroomName: true,
                facultyUserId: true,
                classroomOrgId: true,
                _count: {
                    select: {classroomEnrollments: true}
                
                },
                User:{
                    select:{
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