import {withMiddlewares} from "@/util/middleware";
import {
	CreateClassroomResourcesBody,
	CreateClassroomResourcesParams,
	DeleteClassroomResourcesParams
} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser, requireBodyParams,
	requireURLParams, validateBodyParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {UserType} from "@prisma/client";
import {
	CreateClassroomResourcesBodyValidator,
	CreateClassroomResourcesParamsValidator, DeleteClassroomResourcesParamsValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import {CreateClassroomResourceResponse} from "@/util/api/api_responses";

export const DELETE = withMiddlewares<DeleteClassroomResourcesParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Teacher],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(DeleteClassroomResourcesParamsValidator),
	async (req, res) => {
		const {classroomId, resourceId} = req.params

		await db.classroomResource.deleteMany({
			where: {
				classroomId: classroomId,
				resourceId: resourceId
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)
