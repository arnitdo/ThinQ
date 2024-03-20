import {withMiddlewares} from "@/util/middleware";
import {ClassroomParams, EnrollmentQueryParams, NoParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireQueryParams,
	requireURLParams,
	validateQueryParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	ClassroomParamServerValidator,
	EnrollmentQueryParamServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import {DeletedEnrollmentResponse, GetEnrollmentsResponse} from "@/util/api/api_responses";

export const HEAD = withMiddlewares<ClassroomParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params

		const createdEnrollment = await db.classroomEnrollment.create({
			data: {
				classroomId: classroomId,
				userId: req.user!.userId
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdEnrollment: createdEnrollment
		})
	}
)

export const GET = withMiddlewares<ClassroomParams>(
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params

		const enrollments = await db.classroomEnrollment.findMany({
			where: {
				classroomId: classroomId
			}
		})

		res.status(200).json<GetEnrollmentsResponse>({
			responseStatus: "SUCCESS",
			enrollments: enrollments
		})
	}
)

export const DELETE = withMiddlewares<ClassroomParams, NoParams, EnrollmentQueryParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId"]),
	requireQueryParams(["userId"]),
	validateURLParams(ClassroomParamServerValidator),
	validateQueryParams(EnrollmentQueryParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params
		const { userId } = req.query
		const deletedEnrollment = await db.classroomEnrollment.delete({
			where: {
				userId_classroomId: {
					userId: userId,
					classroomId: classroomId
				}
			}
		})

		if (!deletedEnrollment) return res.status(404).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<DeletedEnrollmentResponse>({
			responseStatus: "SUCCESS",
			deletedEnrollment: deletedEnrollment!
		})
	}
)