import {withMiddlewares} from "@/util/middleware";
import {CreateQuizBody, LectureParams} from "@/util/api/api_requests";
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
	CreateQuizBodyServerValidator,
	LectureParamServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import {GetQuizesResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<LectureParams, CreateQuizBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	requireBodyParams(["quizName"]),
	validateBodyParams(CreateQuizBodyServerValidator),
	async (req, res) => {
		const { quizName } = req.body
		const { orgId, classroomId, lectureId } = req.params

		const createdQuiz = await db.quiz.create({
			data: {
				lectureId: lectureId,
				quizName: quizName
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdQuizId: createdQuiz.quizId
		})
	}
)

export const GET = withMiddlewares<LectureParams>(
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const quizzes = await db.quiz.findMany({
			where: {
				lectureId: lectureId
			}
		})

		res.status(200).json<GetQuizesResponse>({
			responseStatus: "SUCCESS",
			quizes: quizzes
		})
	}
)