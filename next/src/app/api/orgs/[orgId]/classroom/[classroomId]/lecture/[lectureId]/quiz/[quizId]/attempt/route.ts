import { withMiddlewares } from "@/util/middleware";
import { CreateQuizAttemptBody, QuizParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateQuizAttemptBodyServerValidator, QuizParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetQuizAttemptsResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<QuizParams, CreateQuizAttemptBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher", "Student"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	requireBodyParams(["attemptTimestamp"]),
	validateBodyParams(CreateQuizAttemptBodyServerValidator),
	async (req, res) => {
		const { attemptTimestamp } = req.body
		const { orgId, classroomId, lectureId, quizId } = req.params

		const createdQuizAttempt = await db.quizAttempt.create({
			data: {
				quizId: quizId,
				userId: req.user!.userId,
				attemptTimestamp: new Date(attemptTimestamp)
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdQuizAttemptId: createdQuizAttempt.attemptId
		})
	}
)

export const GET = withMiddlewares<QuizParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId } = req.params
		const quizAttempts = await db.quizAttempt.findMany({
			where: {
				quizId: quizId
			}
		})

		res.status(200).json<GetQuizAttemptsResponse>({
			responseStatus: "SUCCESS",
			quizAttempts: quizAttempts
		})
	}
)