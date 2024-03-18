import { withMiddlewares } from "@/util/middleware";
import { CreateReportTargetBody, ReportTargetParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateReportTargetBodyServerValidator, ReportTargetParamsServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedReportTargetResponse, GetReportTargetResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<ReportTargetParams, CreateReportTargetBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["reportTargetId"]),
	validateURLParams(ReportTargetParamsServerValidator),
	requireBodyParams(["reportTargetEmail"]),
	validateBodyParams(CreateReportTargetBodyServerValidator),
	async (req, res) => {
		const { reportTargetEmail } = req.body
		const { reportTargetId } = req.params

		const updatedReportTarget = await db.reportTarget.update({
			where: {
				userId_reportTargetId: {
					userId: req.user!.userId,
					reportTargetId: reportTargetId
				}
			},
			data: {
				reportTargetEmail: reportTargetEmail
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedReportTargetId: updatedReportTarget.reportTargetId
		})
	}
)

export const GET = withMiddlewares<ReportTargetParams>(
	requireURLParams(["reportTargetId"]),
	validateURLParams(ReportTargetParamsServerValidator),
	async (req, res) => {
		const { reportTargetId } = req.params
		const reportTarget = await db.reportTarget.findFirst({
			where: {
				reportTargetId: reportTargetId
			}
		})

		res.status(200).json<GetReportTargetResponse>({
			responseStatus: "SUCCESS",
			reportTarget: reportTarget!
		})
	}
)

export const DELETE = withMiddlewares<ReportTargetParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["reportTargetId"]),
	validateURLParams(ReportTargetParamsServerValidator),
	async (req, res) => {
		const { reportTargetId } = req.params
		const reportTarget = await db.reportTarget.delete({
			where: {
				userId_reportTargetId: {
					userId: req.user!.userId,
					reportTargetId: reportTargetId
				}
			}
		})

		res.status(200).json<DeletedReportTargetResponse>({
			responseStatus: "SUCCESS",
			deletedReportTarget: reportTarget!
		})
	}
)