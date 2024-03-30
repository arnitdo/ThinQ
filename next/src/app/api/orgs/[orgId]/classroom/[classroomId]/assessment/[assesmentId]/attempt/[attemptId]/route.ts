import { withMiddlewares } from "@/util/middleware";
import { ClassAssesmentAttemptParams, QuizAttemptParams } from "@/util/api/api_requests";
import { requireURLParams, validateURLParams } from "@/util/middleware/helpers";
import { ClassAssesmentAttemptParamServerValidator, QuizAttemptParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetAssessmentAttemptResponse, GetQuizAttemptResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares<ClassAssesmentAttemptParams>(
	requireURLParams(["orgId", "classroomId", "assesmentId", "attemptId"]),
	validateURLParams(ClassAssesmentAttemptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, assesmentId, attemptId } = req.params
		const quizAttempt = await db.assessmentAttempt.findFirst({
			where: {
				attemptId: attemptId,
			}
		})

		res.status(200).json<GetAssessmentAttemptResponse>({
			responseStatus: "SUCCESS",
			assessmentAttempt: quizAttempt!
		})
	}
)