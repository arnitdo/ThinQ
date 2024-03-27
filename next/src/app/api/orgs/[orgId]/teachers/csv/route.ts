import {withMiddlewares} from "@/util/middleware";
import {parse} from "csv-parse/sync";
import {CreateBulkUserBody, CreateBulkUserParams, NoParams} from "@/util/api/api_requests";
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
	BaseOrgIdParamServerValidator,
	CreateBulkStudentsServerValidator,
	CreateBulkUsersServerValidator,
	matchUserOrgWithParamsOrg
} from "@/util/validators/server";
import db from "@/util/db";
import bcrypt from "bcrypt";

type ParsedData = {
	userName: string,
	userDisplayName: string,
	userPassword: string
}

export const POST = withMiddlewares<CreateBulkUserParams, CreateBulkUserBody, NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Administrator],
		matchUserOrganization: matchUserOrgWithParamsOrg
	}),
	requireURLParams(["orgId"]),
	validateURLParams(BaseOrgIdParamServerValidator),
	requireBodyParams(["csvData"]),
	validateBodyParams(CreateBulkStudentsServerValidator),
	async (req, res) => {
		const {csvData} = req.body
		const {orgId} = req.params
		const parsedData = parse(csvData, {
			trim: true,
			columns: ["userName", "userDisplayName", "userPassword"]
		}) as ParsedData[]

		await Promise.all(
			parsedData.map(async (parsedObj) => {
				try {
					const userExists = await db.user.findFirst({
						where: {
							userName: parsedObj.userName
						}
					})

					if (userExists !== null) {
						return
					}

					const mappedObj = {
						...parsedObj,
						userPassword: await bcrypt.hash(parsedObj.userPassword, 10),
						userOrgId: orgId,
						userType: UserType.Teacher
					}

					const createdUser = await db.user.create({
						data: mappedObj
					})

					return
				} catch (e) {
					console.error(e)
					return
				}
			})
		)

		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)