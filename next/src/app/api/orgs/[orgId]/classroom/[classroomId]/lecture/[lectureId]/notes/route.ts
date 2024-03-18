import { withMiddlewares } from "@/util/middleware";
import { CreateNotesBody, LectureParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateNotesBodyServerValidator, LectureParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetNotesResponse } from "@/util/api/api_responses";

export const POST = withMiddlewares<LectureParams, CreateNotesBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	requireBodyParams(["notesContent"]),
	validateBodyParams(CreateNotesBodyServerValidator),
	async (req, res) => {
		const { notesContent, notesTitle } = req.body
		const { orgId, classroomId, lectureId } = req.params

		const createdNotes = await db.notes.create({
			data: {
				notesContent: notesContent,
				notesTitle: notesTitle ? notesTitle : "",
				lectureId: lectureId
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			createdNotesId: createdNotes.notesId
		})
	}
)

export const GET = withMiddlewares<LectureParams>(
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(LectureParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId } = req.params
		const notes = await db.notes.findFirst({
			where: {
				lectureId: lectureId
			}
		})

		if (!notes) return res.status(400).json({ responseStatus: "ERR_NOT_FOUND" })

		res.status(200).json<GetNotesResponse>({
			responseStatus: "SUCCESS",
			notes: notes
		})
	}
)