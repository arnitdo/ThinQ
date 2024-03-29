import {withMiddlewares} from "@/util/middleware";
import {ClassroomParams} from "@/util/api/api_requests";
import {
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	ClassroomParamServerValidator,
} from "@/util/validators/server";
import db from "@/util/db";
import { GetAllQuizzesResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<ClassroomParams>(
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params
		const quizzes = await db.quiz.findMany({
			where: {
				quizLecture: {
					lectureClassroomId: classroomId,
					lectureClassroom: {
						classroomOrgId: orgId
					}
				}
			}
		})

		if (!quizzes) return res.status(400).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<GetAllQuizzesResponse>({
			responseStatus: "SUCCESS",
			quizzes: quizzes
		})
	}
)