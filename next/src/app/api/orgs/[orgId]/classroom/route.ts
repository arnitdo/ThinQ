import {withMiddlewares} from "@/util/middleware";
import {CreateClassroomBody, OrgIdBaseParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireBodyParams,
	requireURLParams,
	validateBodyParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	BaseOrgIdParamServerValidator,
	CreateClassroomBodyServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import {GetClassroomsResponse} from "@/util/api/api_responses";
import {UserType} from "@prisma/client";

export const POST = withMiddlewares<OrgIdBaseParams, CreateClassroomBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Teacher, UserType.Administrator],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	requireBodyParams(["classroomName", "facultyId"]),
	validateBodyParams(CreateClassroomBodyServerValidator),
	async (req, res) => {
		const { classroomName, facultyId } = req.body
		const { orgId } = req.params

		const createdClass = await db.classroom.create({
			data: {
				classroomName: classroomName,
				classroomOrgId: orgId,
				facultyUserId: facultyId,
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdClassId: createdClass.classroomId
		})
	}
)

export const GET = withMiddlewares<OrgIdBaseParams>(
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const { orgId } = req.params
		const classrooms = await db.classroom.findMany({
			where: {
				classroomOrgId: orgId
			}
		})

		res.status(200).json<GetClassroomsResponse>({
			responseStatus: "SUCCESS",
			classrooms: classrooms
		})
	}
)