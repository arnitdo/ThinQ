import {withMiddlewares} from "@/util/middleware";
import {CreateQuizQuestionBody, QuizQuestionParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireBodyParams,
	requireURLParams,
	validateBodyParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	CreateQuizQuestionBodyServerValidator,
	matchUserOrgWithParamsOrg,
	QuizQuestionParamServerValidator
} from "@/util/validators/server";
import db from "@/util/db";
import {DeletedQuizQuestionResponse, GetQuizQuestionResponse} from "@/util/api/api_responses";

export const PUT = withMiddlewares<QuizQuestionParams, CreateQuizQuestionBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "questionId"]),
	validateURLParams(QuizQuestionParamServerValidator),
	requireBodyParams(["questionAnswerIndex", "questionOptions", "questionText"]),
	validateBodyParams(CreateQuizQuestionBodyServerValidator),
	async (req, res) => {
		const { questionAnswerIndex, questionOptions, questionText } = req.body
		const { orgId, classroomId, lectureId, quizId, questionId } = req.params

		const updatedQuizQuestion = await db.quizQuestion.update({
			where: {
				questionId: questionId
			},
			data: {
				questionAnswerIndex: questionAnswerIndex,
				questionOptions: questionOptions,
				questionText: questionText
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedQuizQuestionId: updatedQuizQuestion.questionId
		})
	}
)

export const GET = withMiddlewares<QuizQuestionParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "questionId"]),
	validateURLParams(QuizQuestionParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId, questionId } = req.params
		const quizQuestion = await db.quizQuestion.findFirst({
			where: {
				questionId: questionId
			}
		})

		res.status(200).json<GetQuizQuestionResponse>({
			responseStatus: "SUCCESS",
			quizQuestion: quizQuestion!
		})
	}
)

export const DELETE = withMiddlewares<QuizQuestionParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId", "questionId"]),
	validateURLParams(QuizQuestionParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId, questionId } = req.params
		const deletedQuizQuestion = await db.quizQuestion.delete({
			where: {
				questionId: questionId
			}
		})

		if (!deletedQuizQuestion) return res.status(404).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<DeletedQuizQuestionResponse>({
			responseStatus: "SUCCESS",
			deletedQuizQuestion: deletedQuizQuestion!
		})
	}
)