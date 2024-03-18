import { withMiddlewares } from "@/util/middleware";
import { ClassroomParams, EditClassroomBody } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { ClassroomParamServerValidator, EditClassroomBodyServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedClassroomResponse, GetClassroomResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<ClassroomParams, EditClassroomBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	requireBodyParams(["classroomName"]),
	validateBodyParams(EditClassroomBodyServerValidator),
	async (req, res) => {
		const { classroomName } = req.body
		const { orgId, classroomId } = req.params

		const updatedClass = await db.classroom.update({
			where: {
				classroomId: classroomId
			},
			data: {
				classroomName: classroomName,
				classroomOrgId: orgId
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedClassId: updatedClass.classroomId
		})
	}
)

export const GET = withMiddlewares<ClassroomParams>(
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params
		const classroom = await db.classroom.findFirst({
			where: {
				classroomId: classroomId
			}
		})

		res.status(200).json<GetClassroomResponse>({
			responseStatus: "SUCCESS",
			classroom: classroom!
		})
	}
)

export const DELETE = withMiddlewares<ClassroomParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params
		const classroom = await db.classroom.delete({
			where: {
				classroomId: classroomId
			}
		})

		res.status(200).json<DeletedClassroomResponse>({
			responseStatus: "SUCCESS",
			deletedClassroom: classroom!
		})
	}
)