import {withMiddlewares} from "@/util/middleware";
import {ClassAssesmentAttemptParams, ClassAssesmentParams, ClassQuizIdParams, CreateQuizAttemptBody, NoParams, QuizParams} from "@/util/api/api_requests";
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
	ClassAssessmentParamServerValidator,
	ClassQuizIdParamServerValidator,
	CreateQuizAttemptBodyServerValidator,
	matchUserOrgWithParamsOrg,
	QuizParamServerValidator
} from "@/util/validators/server";
import db from "@/util/db";
import {CreateAssessmentAttemptResponse, CreateQuizAttemptResponse, GetAssessmentAttemptResponse, GetAssessmentAttemptsResponse, GetClassroomAssessmentResponse, GetQuizAttemptsResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<ClassAssesmentParams, NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student"], matchUserOrganization: matchUserOrgWithParamsOrg }),
	requireURLParams(["orgId","classroomId", "assesmentId"]),
	validateURLParams(ClassAssessmentParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, assesmentId } = req.params

		const oldQuizAttempt = await db.assessmentAttempt.findFirst({
			where:{
                assessmentId:assesmentId,
				userId:req.user!.userId
			}
		})

		if(oldQuizAttempt){
			return res.status(200).json<CreateAssessmentAttemptResponse>({
				responseStatus: "SUCCESS",
				createdAssessmentAttemptId: oldQuizAttempt.attemptId
			})
		}

		const createdQuizAttempt = await db.assessmentAttempt.create({
			data: {
				assessmentId: assesmentId,
				userId: req.user!.userId,
			}
		})

		res.status(200).json<CreateAssessmentAttemptResponse>({
			responseStatus: "SUCCESS",
			createdAssessmentAttemptId: createdQuizAttempt.attemptId
		})
	}
)

export const GET = withMiddlewares<ClassAssesmentParams>(
	requireURLParams(["orgId", "classroomId", "assesmentId"]),
	validateURLParams(ClassAssessmentParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, assesmentId } = req.params
		const quizAttempts = await db.assessmentAttempt.findMany({
			where: {
				assessmentId: assesmentId
			}
		})

		res.status(200).json<GetAssessmentAttemptsResponse>({
			responseStatus: "SUCCESS",
			assessmentAttempts: quizAttempts
		})
	}
)