import {withMiddlewares} from "@/util/middleware";
import {ClassAssesmentAttemptParams, ClassQuizAttemptParams, CreateAssessmentResponseBody, CreateQuizResponseBody, QuizAttemptParams, QuizResponseQueryParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireBodyParams,
	requireQueryParams,
	requireURLParams,
	validateBodyParams,
	validateQueryParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {
	ClassAssessmentAttemptParamServerValidator,
	ClassQuizAttemptParamServerValidator,
	CreateAssessmentResponseBodyServerValidator,
	CreateQuizResponseBodyServerValidator,
	matchUserOrgWithParamsOrg,
	QuizAttemptParamServerValidator,
	QuizParamServerValidator,
	QuizResponseQueryServerValidator
} from "@/util/validators/server";
import db from "@/util/db";
import {GetAssessmentResponsesResponse, GetQuizResponsesResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<ClassAssesmentAttemptParams, CreateAssessmentResponseBody, QuizResponseQueryParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher", "Student"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId", "classroomId", "assesmentId", "attemptId"]),
	validateURLParams(ClassAssessmentAttemptParamServerValidator),
	requireBodyParams(["responseObtainedMarks","responseText"]),
	validateBodyParams(CreateAssessmentResponseBodyServerValidator),
	requireQueryParams(["questionId"]),
	validateQueryParams(QuizResponseQueryServerValidator),
	async (req, res) => {
		const { responseObtainedMarks, responseText } = req.body
		const { orgId, classroomId, assesmentId, attemptId } = req.params

		const oldResponse = await db.assessmentResponse.findFirst({
			where: {
				attemptId: attemptId,
				responseQuestionId: req.query.questionId,
			}
		})

		if (oldResponse) {
			return res.status(200).json({ responseStatus: "SUCCESS" })
		}

		const createdQuizResponse = await db.assessmentResponse.create({
			data: {
				responseQuestionId: req.query.questionId,
				attemptId: attemptId,
				responseObtainedMarks: responseObtainedMarks,
				responseText: responseText
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdQuizResponseId: createdQuizResponse.attemptId
		})
	}
)

export const GET = withMiddlewares<ClassAssesmentAttemptParams>(
	requireURLParams(["orgId", "classroomId", "assesmentId", "attemptId"]),
	validateURLParams(ClassAssessmentAttemptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, assesmentId, attemptId } = req.params
		const quizResponses = await db.assessmentResponse.findMany({
			where: {
				attemptId: attemptId
			}
		})

		res.status(200).json<GetAssessmentResponsesResponse>({
			responseStatus: "SUCCESS",
			assessmentResponses: quizResponses
		})
	}
)