import {withMiddlewares} from "@/util/middleware";
import {ClassQuizIdParams, CreateQuizAttemptBody, QuizParams} from "@/util/api/api_requests";
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
	ClassQuizIdParamServerValidator,
	CreateQuizAttemptBodyServerValidator,
	matchUserOrgWithParamsOrg,
	QuizParamServerValidator
} from "@/util/validators/server";
import db from "@/util/db";
import {CreateQuizAttemptResponse, GetQuizAttemptsResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<ClassQuizIdParams, CreateQuizAttemptBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher", "Student"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId","classroomId", "quizId"]),
	validateURLParams(ClassQuizIdParamServerValidator),
	requireBodyParams(["attemptTimestamp"]),
	validateBodyParams(CreateQuizAttemptBodyServerValidator),
	async (req, res) => {
		const { attemptTimestamp } = req.body
		const { orgId, classroomId, quizId } = req.params

		const createdQuizAttempt = await db.quizAttempt.create({
			data: {
				quizId: quizId,
				userId: req.user!.userId,
				attemptTimestamp: new Date(attemptTimestamp)
			}
		})

		res.status(200).json<CreateQuizAttemptResponse>({
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