import { withMiddlewares } from "@/util/middleware";
import { CreateQuizResponseBody, QuizAttemptParams, QuizResponseQueryParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireQueryParams, requireURLParams, validateBodyParams, validateQueryParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateQuizResponseBodyServerValidator, QuizAttemptParamServerValidator, QuizParamServerValidator, QuizResponseQueryServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetQuizResponsesResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<QuizAttemptParams, CreateQuizResponseBody, QuizResponseQueryParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher", "Student"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "attemptId"]),
	validateURLParams(QuizAttemptParamServerValidator),
	requireBodyParams(["responseAccuracy"]),
	validateBodyParams(CreateQuizResponseBodyServerValidator),
	requireQueryParams(["questionId"]),
	validateQueryParams(QuizResponseQueryServerValidator),
	async (req, res) => {
		const { responseAccuracy, responseContent } = req.body
		const { orgId, classroomId, lectureId, quizId, attemptId } = req.params

		const oldResponse = await db.quizResponse.findFirst({
			where: {
				attemptId: attemptId,
				questionId: req.query.questionId
			}
		})

		if (oldResponse) {
			return res.status(400).json({ responseStatus: "ERR_UNAUTHORIZED" })
		}

		const createdQuizResponse = await db.quizResponse.create({
			data: {
				questionId: req.query.questionId,
				attemptId: attemptId,
				responseAccuracy: responseAccuracy,
				responseContent: responseContent ? responseContent : ""
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdQuizResponseId: createdQuizResponse.attemptId
		})
	}
)

export const GET = withMiddlewares<QuizAttemptParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "attemptId"]),
	validateURLParams(QuizParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId, attemptId } = req.params
		const quizResponses = await db.quizResponse.findMany({
			where: {
				attemptId: attemptId
			}
		})

		res.status(200).json<GetQuizResponsesResponse>({
			responseStatus: "SUCCESS",
			quizResponses: quizResponses
		})
	}
)