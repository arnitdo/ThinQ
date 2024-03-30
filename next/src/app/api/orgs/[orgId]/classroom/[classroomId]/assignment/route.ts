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
import {
	CreateAssignmentBodyValidator,
	CreateAssignmentParamsValidator,
	GetClassroomAssignmentsParamsValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import {UserType} from "@prisma/client";
import {CreateAssignmentBody, CreateAssignmentParams, GetAssignmentParams} from "@/util/api/api_requests";
import db from "@/util/db";
import {CreateAssignmentResponse, GetClassroomAssignmentResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<CreateAssignmentParams, CreateAssignmentBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Teacher],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(CreateAssignmentParamsValidator),
	requireBodyParams(["assignmentName"]),
	validateBodyParams(CreateAssignmentBodyValidator),
	async (req, res) => {
		const {orgId, classroomId} = req.params
		const {assignmentName} = req.body

		const createdAssignment = await db.assignment.create({
			data: {
				assignmentClassroomId: classroomId,
				assignmentName: assignmentName
			}
		})

		res.status(200).json<CreateAssignmentResponse>({
			responseStatus: "SUCCESS",
			assignmentId: createdAssignment.assignmentId
		})
	}
)

export const GET = withMiddlewares<GetAssignmentParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Student, UserType.Teacher, UserType.Administrator],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(GetClassroomAssignmentsParamsValidator),
	async (req, res) => {
		const {classroomId} = req.params

		const allAssignments = await db.assignment.findMany({
			where: {
				assignmentClassroomId: classroomId
			}
		})

		res.status(200).json<GetClassroomAssignmentResponse>({
			responseStatus: "SUCCESS",
			classroomAssignments: allAssignments
		})
	}
)