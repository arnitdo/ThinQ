import {withMiddlewares} from "@/util/middleware";
import {CreateTranscriptBody, LectureParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireBodyParams,
	requireURLParams,
	validateBodyParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {CreateTranscriptBodyServerValidator, LectureParamServerValidator} from "@/util/validators/server";
import db from "@/util/db";
import {GetTrancriptsResponse} from "@/util/api/api_responses";
import {getObjectUrl} from "@/util/s3/server";

export const POST = withMiddlewares<LectureParams, CreateTranscriptBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	requireBodyParams(["transcriptText"]),
	validateBodyParams(CreateTranscriptBodyServerValidator),
	async (req, res) => {
		const { transcriptText } = req.body
		const { orgId, classroomId, lectureId } = req.params

		const createdTranscript = await db.lectureTranscript.create({
			data: {
				lectureId: lectureId,
				transcriptText: transcriptText,
			}
		})

		const textFile = Buffer.from(transcriptText)

		const s3Url = await getObjectUrl({
			objectKey: `orgs/${orgId}/classrooms/${classroomId}/lectures/${lectureId}/${createdTranscript.transcriptId}.txt`,
			requestMethod: "PUT"
		})

		const s3Resp = await fetch(
			s3Url,
			{
				body: textFile,
				method: "PUT",
				headers: {
					"Content-Type": "text/plain"
				}
			},
		)

		if (!s3Resp.ok){
			return res.status(500).json({
				responseStatus: "ERR_INTERNAL_ERROR"
			})
		}

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdTranscriptId: createdTranscript.transcriptId
		})
	}
)

export const GET = withMiddlewares<LectureParams>(
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const transcripts = await db.lectureTranscript.findMany({
			where: {
				lectureId: lectureId
			}
		})

		res.status(200).json<GetTrancriptsResponse>({
			responseStatus: "SUCCESS",
			transcripts: transcripts
		})
	}
)