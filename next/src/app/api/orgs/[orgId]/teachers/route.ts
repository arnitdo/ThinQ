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
			}
		})

        const faculties = allClasses.map( (classroom) => classroom.facultyUserId )
        
        const allTeachers = await db.user.findMany({
            where: {
                userId: {
                    in: faculties
                }
            },
            select: {
                userId: true,
                userName: true,
                userDisplayName: true,
                userType: true,
                userOrgId: true
            }
        })

		res.status(200).json<GetUsersResponse>({
			responseStatus: "SUCCESS",
			users: allTeachers
		})
	}
)