import {withMiddlewares} from "@/util/middleware";
import {CreateOrganizationBody, NoParams} from "@/util/api/api_requests";
import {requireBodyParams, validateBodyParams} from "@/util/middleware/helpers";
import {CreateOrgBodyServerValidator} from "@/util/validators/server";
import db from "@/util/db";
import {GetOrgsResponse} from "@/util/api/api_responses";
import {UserType} from "@prisma/client";
import bcrypt from "bcrypt";

export const POST = withMiddlewares<NoParams, CreateOrganizationBody, NoParams>(
	requireBodyParams(["orgId", "orgName"]),
	validateBodyParams(CreateOrgBodyServerValidator),
	async (req, res) => {
		const { orgName, orgId } = req.body

		const createdOrg = await db.organization.create({
			data: {
				orgId: orgId,
				orgName: orgName
			}
		})

		// Create a default admin user as well
		const createdAdminUser = await db.user.create({
			data: {
				userOrgId: createdOrg.orgId,
				userDisplayName: `${orgId} Admin`,
				userType: UserType.Administrator,
				userName: `${orgId}-admin`,
				userPassword: await bcrypt.hash(process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD!, 10)
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)

export const GET = withMiddlewares(
	async (req, res) => {
		const allOrgs = await db.organization.findMany()

		res.status(200).json<GetOrgsResponse>({
			responseStatus: "SUCCESS",
			allOrgs: allOrgs
		})
	}
)