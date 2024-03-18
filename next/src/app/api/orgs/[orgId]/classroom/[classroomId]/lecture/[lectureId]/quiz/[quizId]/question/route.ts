import { withMiddlewares } from "@/util/middleware";
import { CreateQuizQuestionBody, QuizParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateQuizQuestionBodyServerValidator, QuizParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetQuizQuestionsResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<QuizParams, CreateQuizQuestionBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	requireBodyParams(["questionAnswerIndex", "questionOptions", "questionText"]),
	validateBodyParams(CreateQuizQuestionBodyServerValidator),
	async (req, res) => {
		const { questionAnswerIndex, questionOptions, questionText } = req.body
		const { orgId, classroomId, lectureId, quizId } = req.params

		const createdQuizQuestion = await db.quizQuestion.create({
			data: {
				quizId: quizId,
				questionAnswerIndex: questionAnswerIndex,
				questionOptions: questionOptions,
				questionText: questionText
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdQuizQuestionId: createdQuizQuestion.questionId
		})
	}
)

export const GET = withMiddlewares<QuizParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId } = req.params
		const quizQuestions = await db.quizQuestion.findMany({
			where: {
				quizId: quizId
			}
		})

		res.status(200).json<GetQuizQuestionsResponse>({
			responseStatus: "SUCCESS",
			quizQuestions: quizQuestions
		})
	}
)