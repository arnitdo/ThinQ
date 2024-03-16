import {withMiddlewares} from "@/util/middleware";
import {AuthSignupUserBodyServerValidator, AuthSignupUserParamsServerValidator} from "@/util/validators/server";
import {requireBodyParams, requireURLParams, validateBodyParams, validateURLParams} from "@/util/middleware/helpers";
import {AuthSignupUserBody, AuthSignupUserParams} from "@/util/api/api_requests";
import db from "@/util/db";
import bcrypt from "bcrypt";
import {AuthSignupUserResponse} from "@/util/api/api_responses";

export const POST = withMiddlewares<AuthSignupUserParams, AuthSignupUserBody>(
	requireURLParams(["orgId"]),
	validateURLParams(AuthSignupUserParamsServerValidator),
	requireBodyParams(["userDisplayName", "userPassword", "userType", "userName"]),
	validateBodyParams(AuthSignupUserBodyServerValidator),
	async (req, res) => {
		const {orgId} = req.params
		const {userName, userPassword, userDisplayName, userType} = req.body

		const hashedPassword = await bcrypt.hash(userPassword, 10);

		const createdUser = await db.user.create({
			data: {
				userOrgId: orgId,
				userName: userName,
				userPassword: hashedPassword,
				userType: userType,
				userDisplayName: userDisplayName
			}
		})

		res.status(200).json<AuthSignupUserResponse>({
			responseStatus: "SUCCESS",
			userType: createdUser.userType,
			userOrgId: createdUser.userOrgId,
			userId: createdUser.userId
		})
	}
)