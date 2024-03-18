import { withMiddlewares } from "@/util/middleware";
import { CreateClassroomBody, OrgIdBaseParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { BaseOrgIdParamServerValidator, CreateClassroomBodyServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetClassroomsResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<OrgIdBaseParams, CreateClassroomBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	requireBodyParams(["classroomName"]),
	validateBodyParams(CreateClassroomBodyServerValidator),
	async (req, res) => {
		const { classroomName } = req.body
		const { orgId } = req.params

		const createdClass = await db.classroom.create({
			data: {
				classroomName: classroomName,
				classroomOrgId: orgId
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
		const org = await db.organization.findFirst({
			where: {
				orgId: orgId
			}
		})

		if (!org) return res.status(404).json({ responseStatus: "ERR_INVALID_URL_PARAMS", invalidParams: ["orgId"] })

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