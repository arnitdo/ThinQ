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
		const allClasses = await db.classroom.findMany({
			where: {
				classroomOrgId: req.params.orgId
			},
			select: {
				classroomEnrollments: {
					select: {
						enrolledUser: true
					}
				}
			}
		})

        const users = allClasses.map( (classroom) => classroom.classroomEnrollments.map( (enrollment) => enrollment.enrolledUser ) ).flat()

		res.status(200).json<GetUsersResponse>({
			responseStatus: "SUCCESS",
			users: users
		})
	}
)