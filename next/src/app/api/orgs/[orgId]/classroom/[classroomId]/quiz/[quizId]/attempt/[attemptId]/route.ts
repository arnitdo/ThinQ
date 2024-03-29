import { withMiddlewares } from "@/util/middleware";
import { QuizAttemptParams } from "@/util/api/api_requests";
import { requireURLParams, validateURLParams } from "@/util/middleware/helpers";
import { QuizAttemptParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetQuizAttemptResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares<QuizAttemptParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "attemptId"]),
	validateURLParams(QuizAttemptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId, attemptId } = req.params
		const quizAttempt = await db.quizAttempt.findFirst({
			where: {
				attemptId: attemptId
			}
		})

		res.status(200).json<GetQuizAttemptResponse>({
			responseStatus: "SUCCESS",
			quizAttempt: quizAttempt!
		})
	}
)