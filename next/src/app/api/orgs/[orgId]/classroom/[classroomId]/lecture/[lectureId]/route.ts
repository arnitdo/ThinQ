import { withMiddlewares } from "@/util/middleware";
import { EditLectureBody, LectureParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { EditLectureBodyServerValidator, LectureParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedLectureResponse, GetLectureResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<LectureParams, EditLectureBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	requireBodyParams(["lectureEndTimestamp", "lectureStartTimestamp", "title"]),
	validateBodyParams(EditLectureBodyServerValidator),
	async (req, res) => {
		const { lectureEndTimestamp, lectureStartTimestamp, title } = req.body
		const { orgId, classroomId, lectureId } = req.params

		const updatedLecture = await db.lecture.update({
			where: {
				lectureId: lectureId
			},
			data: {
				title: title,
				lectureStartTimestamp: new Date(lectureStartTimestamp),
				lectureEndTimestamp: new Date(lectureEndTimestamp)
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedLectureId: updatedLecture.lectureId
		})
	}
)

export const GET = withMiddlewares<LectureParams>(
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const lecture = await db.lecture.findFirst({
			where: {
				lectureId: lectureId
			}
		})

		res.status(200).json<GetLectureResponse>({
			responseStatus: "SUCCESS",
			lecture: lecture!
		})
	}
)

export const DELETE = withMiddlewares<LectureParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const lecture = await db.lecture.delete({
			where: {
				lectureId: lectureId
			}
		})

		res.status(200).json<DeletedLectureResponse>({
			responseStatus: "SUCCESS",
			deletedLecture: lecture!
		})
	}
)