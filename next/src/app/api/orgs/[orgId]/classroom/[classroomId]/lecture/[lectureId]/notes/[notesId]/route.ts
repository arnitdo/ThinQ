import { withMiddlewares } from "@/util/middleware";
import { EditNotesBody, NotesParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireBodyParams, requireURLParams, validateBodyParams, validateURLParams } from "@/util/middleware/helpers";
import { CreateNotesBodyServerValidator, NotesParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { DeletedNotesResponse, GetNotesResponse } from "@/util/api/api_responses";

export const PUT = withMiddlewares<NotesParams, EditNotesBody>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "notesId"]),
	validateURLParams(NotesParamServerValidator),
	requireBodyParams(["notesContent"]),
	validateBodyParams(CreateNotesBodyServerValidator),
	async (req, res) => {
		const { notesContent, notesTitle } = req.body
		const { orgId, classroomId, lectureId, notesId } = req.params

		const updatedNotes = await db.notes.update({
			where: {
				notesId: notesId
			},
			data: {
				notesContent: notesContent,
				notesTitle: notesTitle
			}
		})

		res.status(200).json({
			responseStatus: "SUCCESS",
			updatedNotesId: updatedNotes.notesId
		})
	}
)

export const GET = withMiddlewares<NotesParams>(
	requireURLParams(["orgId", "classroomId", "lectureId", "notesId"]),
	validateURLParams(NotesParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, notesId } = req.params
		const notes = await db.notes.findFirst({
			where: {
				notesId: notesId
			}
		})

		res.status(200).json<GetNotesResponse>({
			responseStatus: "SUCCESS",
			notes: notes!
		})
	}
)

export const DELETE = withMiddlewares<NotesParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId", "lectureId", "notesId"]),
	validateURLParams(NotesParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId, lectureId, notesId } = req.params
		const deletedNotes = await db.notes.delete({
			where: {
				notesId: notesId
			}
		})

		res.status(200).json<DeletedNotesResponse>({
			responseStatus: "SUCCESS",
			deletedNotes: deletedNotes!
		})
	}
)