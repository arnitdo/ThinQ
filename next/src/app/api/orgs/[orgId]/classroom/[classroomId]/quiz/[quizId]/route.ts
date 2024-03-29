import {withMiddlewares} from "@/util/middleware";
import { ClassroomQuizParams} from "@/util/api/api_requests";
import {
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	ClassroomParamServerValidator,
} from "@/util/validators/server";
import db from "@/util/db";
import { GetQuizDataResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<ClassroomQuizParams>(
	requireURLParams(["orgId", "classroomId", "quizId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, quizId } = req.params
		const notes = await db.quiz.findFirst({
			where: {
				quizId: quizId,
                quizLecture: {
                    lectureClassroomId: classroomId,
                    lectureClassroom: {
                        classroomOrgId: orgId
                    }
                }
			},
            select:{
                quizId: true,
                quizName: true,
                quizQuestions: true,
                quizAttempts: true,
                quizLecture: true
            }
		})

		if (!notes) return res.status(400).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<GetQuizDataResponse>({
			responseStatus: "SUCCESS",
			quizData: notes
		})
	}
)