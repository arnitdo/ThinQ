import { withMiddlewares } from "@/util/middleware";
import { EditTranscriptBody, TranscriptParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateTranscriptBodyServerValidator, TranscriptParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedTranscriptResponse, GetTrancriptResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<TranscriptParams, EditTranscriptBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "transcriptId"]),
	validateURLParams(TranscriptParamServerValidator),
	requireBodyParams(["transcriptText"]),
	validateBodyParams(CreateTranscriptBodyServerValidator),
	async (req, res) => {
		const { transcriptText } = req.body
		const { orgId, classroomId, lectureId, transcriptId } = req.params

		const updatedTranscript = await db.lectureTranscript.update({
			where: {
				lectureId_transcriptId: {
					lectureId: lectureId,
					transcriptId: transcriptId
				}
			},
			data: {
				transcriptText: transcriptText
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedTranscriptId: updatedTranscript.transcriptId
		})
	}
)

export const GET = withMiddlewares<TranscriptParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "transcriptId"]),
	validateURLParams(TranscriptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, transcriptId } = req.params
		const transcript = await db.lectureTranscript.findFirst({
			where: {
				transcriptId: transcriptId
			}
		})

		res.status(200).json<GetTrancriptResponse>({
			responseStatus: "SUCCESS",
			transcript: transcript!
		})
	}
)

export const DELETE = withMiddlewares<TranscriptParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "transcriptId"]),
	validateURLParams(TranscriptParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, transcriptId } = req.params
		const deletedTranscript = await db.lectureTranscript.delete({
			where: {
				lectureId_transcriptId: {
					lectureId: lectureId,
					transcriptId: transcriptId
				}
			}
		})

		res.status(200).json<DeletedTranscriptResponse>({
			responseStatus: "SUCCESS",
			deletedTranscript: deletedTranscript!
		})
	}
)