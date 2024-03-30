import {withMiddlewares} from "@/util/middleware";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireBodyParams,
	requireURLParams,
	validateBodyParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {UserType} from "@prisma/client";
import {
	CreateAssessmentBodyValidator,
	CreateAssessmentParamsValidator,
	GetAssessmentParamsValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import {CreateAssessmentBody, CreateAssessmentParams, GetClassAssessmentParams} from "@/util/api/api_requests";
import db from "@/util/db";
import {CreateClassroomAssessmentResponse, GetClassroomAssessmentsResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<CreateAssessmentParams, CreateAssessmentBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Teacher],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(CreateAssessmentParamsValidator),
	requireBodyParams(["assessmentQuestions", "assessmentTitle"]),
	validateBodyParams(CreateAssessmentBodyValidator),
	async (req, res) => {
		const {classroomId, orgId} = req.params
		const {assessmentQuestions, assessmentTitle} = req.body

		const createdAssessment = await db.assessment.create({
			data: {
				classroomId: classroomId,
				assessmentTitle: assessmentTitle,
				assessmentQuestions: {
					createMany: {
						data: assessmentQuestions
					}
				}
			}
		})

		res.status(200).json<CreateClassroomAssessmentResponse>({
			responseStatus: "SUCCESS",
			assessmentId: createdAssessment.assessmentId
		})
	}
)

export const GET = withMiddlewares<GetClassAssessmentParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(GetAssessmentParamsValidator),
	async (req, res) => {
		const {classroomId, orgId} = req.params
		const classAssessments = await db.assessment.findMany({
			where: {
				classroomId: classroomId
			},
			select: {
				assessmentId: true,
				assessmentTitle: true,
				classroomId: true,
				assessmentQuestions: true
			}
		})

		return res.status(200).json<GetClassroomAssessmentsResponse>({
			responseStatus: "SUCCESS",
			classroomAssessment: classAssessments
		})
	}
) 