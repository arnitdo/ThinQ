import { withMiddlewares } from "@/util/middleware";
import { CreateQuizBody, QuizParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateQuizBodyServerValidator, QuizParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedQuizResponse, GetQuizResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<QuizParams, CreateQuizBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	requireBodyParams(["quizName"]),
	validateBodyParams(CreateQuizBodyServerValidator),
	async (req, res) => {
		const { quizName } = req.body
		const { orgId, classroomId, lectureId, quizId } = req.params

		const updatedQuiz = await db.quiz.update({
			where: {
				quizId: quizId
			},
			data: {
				quizName: quizName
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedQuizId: updatedQuiz.quizId
		})
	}
)

export const GET = withMiddlewares<QuizParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId } = req.params
		const quiz = await db.quiz.findFirst({
			where: {
				quizId: quizId
			}
		})

		res.status(200).json<GetQuizResponse>({
			responseStatus: "SUCCESS",
			quiz: quiz!
		})
	}
)

export const DELETE = withMiddlewares<QuizParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "quizId"]),
	validateURLParams(QuizParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, quizId } = req.params
		const deletedQuiz = await db.quiz.delete({
			where: {
				quizId: quizId
			}
		})

		if (!deletedQuiz) return res.status(404).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<DeletedQuizResponse>({
			responseStatus: "SUCCESS",
			deletedQuiz: deletedQuiz!
		})
	}
)