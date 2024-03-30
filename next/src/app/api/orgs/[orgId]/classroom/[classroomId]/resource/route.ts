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
	CreateClassroomResourcesBodyValidator,
	CreateClassroomResourcesParamsValidator,
	GetClassroomResourcesParamsValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import {
	CreateClassroomResourcesBody,
	CreateClassroomResourcesParams,
	GetClassroomResourcesParams
} from "@/util/api/api_requests";
import db from "@/util/db";
import {CreateClassroomResourceResponse, GetClassroomResourcesResponse} from "@/util/api/api_responses";
import {getObjectUrl} from "@/util/s3/server";

export const POST = withMiddlewares<CreateClassroomResourcesParams, CreateClassroomResourcesBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Teacher],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(CreateClassroomResourcesParamsValidator),
	requireBodyParams(["resourceName", "resourceObjectKey"]),
	validateBodyParams(CreateClassroomResourcesBodyValidator),
	async (req, res) => {
		const {classroomId} = req.params
		const {resourceName, resourceObjectKey} = req.body

		const createdResource = await db.classroomResource.create({
			data: {
				classroomId: classroomId,
				resourceObjectKey: resourceObjectKey,
				resourceName: resourceName
			}
		})

		res.status(200).json<CreateClassroomResourceResponse>({
			responseStatus: "SUCCESS",
			resourceId: createdResource.resourceId
		})
	}
)

export const GET = withMiddlewares<GetClassroomResourcesParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Student, UserType.Teacher, UserType.Administrator],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(GetClassroomResourcesParamsValidator),
	async (req, res) => {
		const {classroomId} = req.params
		const allResources = await db.classroomResource.findMany({
			where: {
				classroomId: classroomId
			}
		})

		const mappedResources = await Promise.all(
			allResources.map(async (resourceObj) => {
				return {
					...resourceObj,
					resourceUrl: await getObjectUrl({
						requestMethod: "GET",
						objectKey: resourceObj.resourceObjectKey
					})
				}
			})
		)

		res.status(200).json<GetClassroomResourcesResponse>({
			responseStatus: "SUCCESS",
			classroomResources: mappedResources
		})
	}
)