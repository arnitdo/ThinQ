import { withMiddlewares } from "@/util/middleware";
import { CreateReportTargetBody, NoParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireBodyParams, validateBodyParams } from "@/util/middleware/helpers";
import { CreateReportTargetBodyServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetReportTargetsResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<NoParams, CreateReportTargetBody, NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireBodyParams(["reportTargetEmail"]),
	validateBodyParams(CreateReportTargetBodyServerValidator),
	async (req, res) => {
		const { reportTargetEmail } = req.body

		const createdReportTarget = await db.reportTarget.create({
			data: {
				userId: req.user!.userId,
				reportTargetEmail: reportTargetEmail
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)

export const GET = withMiddlewares(
	authParser(),
	requireAuthenticatedUser(),
	async (req, res) => {
		const reportTarget = await db.reportTarget.findMany({
			where: {
				userId: req.user!.userId
			}
		})

		res.status(200).json<GetReportTargetsResponse>({
			responseStatus: "SUCCESS",
			reportTargets: reportTarget
		})
	}
)