import { withMiddlewares } from "@/util/middleware";
import { CreateAssessmentResponseParams } from "@/util/api/api_requests";
import { requireURLParams, validateURLParams } from "@/util/middleware/helpers";
import { AssessmentAttemptParamServerValidator, QuizAttemptParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetClassroomAssessmentResponse, GetQuizAttemptResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares<CreateAssessmentResponseParams>(
	requireURLParams(["orgId", "classroomId", "assessmentId"]),
	validateURLParams(AssessmentAttemptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, assessmentId } = req.params
		if(!req.user) return 
		const assessmentAttempt = await db.assessment.findFirst({
			where: {
				assessmentId:assessmentId,
				classroomId: classroomId,
			}
		})

		if(!assessmentAttempt)return res.status(404).json({responseStatus:"ERR_INTERNAL_ERROR"})

		res.status(200).json<GetClassroomAssessmentResponse>({
			responseStatus: "SUCCESS",
			classroomAssessment: assessmentAttempt
		})
	}
)