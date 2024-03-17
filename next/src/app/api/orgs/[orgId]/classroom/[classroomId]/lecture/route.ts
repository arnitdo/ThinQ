import {withMiddlewares} from "@/util/middleware";
import {ClassroomParams, CreateClassroomBody, CreateLectureBody, OrgIdBaseParams} from "@/util/api/api_requests";
import {authParser, requireAuthenticatedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams} from "@/util/middleware/helpers";
import {BaseOrgIdParamServerValidator, ClassroomParamServerValidator, CreateClassroomBodyServerValidator, CreateLectureBodyServerValidator} from "@/util/validators/server";
import db from "@/util/db";
import {GetClassroomsResponse, GetLecturesResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<ClassroomParams, CreateLectureBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["orgId","classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	requireBodyParams(["lectureEndTimestamp", "lectureStartTimestamp","title"]),
	validateBodyParams(CreateLectureBodyServerValidator),
	async (req, res) => {
		const { lectureEndTimestamp, lectureStartTimestamp, title } = req.body
		const {orgId, classroomId} = req.params

		const createdLecture = await db.lecture.create({
			data: {
				facultyUserId: req.user!.userId,
				lectureEndTimestamp: new Date(lectureEndTimestamp),
				lectureStartTimestamp: new Date(lectureStartTimestamp),
				lectureClassroomId: classroomId,
				title: title
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdClassId: createdLecture.lectureId
		})
	}
)

export const GET = withMiddlewares<ClassroomParams>(
	requireURLParams(["orgId","classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const {orgId, classroomId} = req.params
		const lectures = await db.lecture.findMany({
			where: {
				lectureClassroomId: classroomId
			}
		})

		res.status(200).json<GetLecturesResponse>({
			responseStatus: "SUCCESS",
			lectures: lectures
		})
	}
)