import {withMiddlewares} from "@/util/middleware";
import {CreateSingleUserBody, CreateSingleUserParams, GetOrgUsersParams} from "@/util/api/api_requests";
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
	BaseOrgIdParamServerValidator,
	CreateSingleUserServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import {UserType} from "@prisma/client";
import db from "@/util/db";
import bcrypt from "bcrypt";
import {CreateSingleUserResponse, GetOrgUsersResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<CreateSingleUserParams, CreateSingleUserBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserOrganization: matchUserOrgWithParamsOrg,
		matchUserTypes: [UserType.Administrator]
	}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	requireBodyParams(["userName", "userDisplayName", "userPassword", "userType"]),
	validateBodyParams(CreateSingleUserServerValidator),
	async (req, res) => {
		const {userName, userDisplayName, userPassword, userType} = req.body

		const hashedPassword = await bcrypt.hash(userPassword, 10)

		const createdUser = await db.user.create({
			data: {
				userName: userName,
				userType: userType,
				userPassword: hashedPassword,
				userOrgId: req.params.orgId,
				userDisplayName: userDisplayName
			}
		})

		res.status(200).json<CreateSingleUserResponse>({
			responseStatus: "SUCCESS",
			userId: createdUser.userId
		})
	}
)

export const GET = withMiddlewares<GetOrgUsersParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserOrganization: matchUserOrgWithParamsOrg,
		matchUserTypes: [UserType.Administrator]
	}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	async (req, res) => {
		const allUsers = await db.user.findMany({
			where: {
				userOrgId: req.params.orgId
			}
		})

		res.status(200).json<GetOrgUsersResponse>({
			responseStatus: "SUCCESS",
			orgUsers: allUsers
		})
	}
)