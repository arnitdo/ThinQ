import {withMiddlewares} from "@/util/middleware";
import {AttendanceQueryParams, LectureParams, NoParams} from "@/util/api/api_requests";
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
	AttendanceQueryParamServerValidator,
	LectureParamServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import {DeletedAttendanceResponse, GetLectureAttendanceResponse} from "@/util/api/api_responses";

export const HEAD = withMiddlewares<LectureParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params

		const oldAttendance = await db.lectureAttendance.findFirst({
			where: {
				lectureId: lectureId,
				userId: req.user!.userId,
			}
		})

		if (oldAttendance) return res.status(200).json({ responseStatus: "SUCCESS", attendance: oldAttendance })
		const createdAttendance = await db.lectureAttendance.create({
			data: {
				lectureId: lectureId,
				userId: req.user!.userId,
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdAttendance: createdAttendance
		})
	}
)

export const GET = withMiddlewares<LectureParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student", "Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params

		const attendance = await db.lectureAttendance.findFirst({
			where: {
				lectureId: lectureId,
				userId: req.user!.userId
			}
		})

		res.status(200).json<GetLectureAttendanceResponse>({
			responseStatus: "SUCCESS",
			attendedLecture: attendance!
		});
	}
)


export const DELETE = withMiddlewares<LectureParams, NoParams, AttendanceQueryParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	requireQueryParams(["userId"]),
	validateURLParams(LectureParamServerValidator),
	validateQueryParams(AttendanceQueryParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const { userId } = req.query
		const deletedAttendance = await db.lectureAttendance.delete({
			where: {
				userId_lectureId: {
					userId: userId,
					lectureId: lectureId
				}
			}
		})

		if (!deletedAttendance) return res.status(404).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<DeletedAttendanceResponse>({
			responseStatus: "SUCCESS",
			deletedAttendance: deletedAttendance!
		})
	}
)