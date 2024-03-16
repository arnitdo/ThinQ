import {withMiddlewares} from "@/util/middleware";
import {AuthLoginUserBody, AuthLoginUserParams} from "@/util/api/api_requests";
import {requireBodyParams, requireURLParams, validateBodyParams, validateURLParams} from "@/util/middleware/helpers";
import {AuthLoginUserBodyServerValidator, AuthLoginUserParamsServerValidator} from "@/util/validators/server";
import db from "@/util/db";
import bcrypt from "bcrypt";
import {AuthUser} from "@/util/middleware/auth";
import {sign} from "jsonwebtoken";
import {FALLBACK_JWT_SECRET} from "@/util/constants";

export const POST = withMiddlewares<AuthLoginUserParams, AuthLoginUserBody>(
	requireURLParams(["orgId"]),
	validateURLParams(AuthLoginUserParamsServerValidator),
	requireBodyParams(["userName", "userPassword"]),
	validateBodyParams(AuthLoginUserBodyServerValidator),
	async (req, res) => {
		const {orgId} = req.params
		const {userName, userPassword: userPass} = req.body

		const fetchedUser = (await db.user.findFirst({
			where: {
				userOrgId: orgId,
				userName: userName
			}
		}))!

		const {userPassword: dbPassword} = fetchedUser

		const isPasswordMatch = await bcrypt.compare(userPass, dbPassword)

		if (!isPasswordMatch){
			res.status(400).json({
				responseStatus: "ERR_INVALID_BODY_PARAMS",
				invalidParams: ["userPassword"]
			})
		} else {
			const authUser: AuthUser = {
				userId: fetchedUser.userId,
				userOrgId: fetchedUser.userOrgId,
				userType: fetchedUser.userType
			}

			const authJWT = sign(authUser, process.env.JWT_SECRET || FALLBACK_JWT_SECRET)

			res.setHeader("Set-Cookie", `auth-token=${authJWT};path=/`)

			res.status(200).json({
				responseStatus: "SUCCESS"
			})
		}
	}
)