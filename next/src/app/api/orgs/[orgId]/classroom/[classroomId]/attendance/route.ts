import { withMiddlewares } from "@/util/middleware";
import { ClassroomParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser, requireURLParams, validateURLParams } from "@/util/middleware/helpers";
import { ClassroomParamServerValidator } from "@/util/validators/server";
import db from "@/util/db";
import { GetClassroomAttendanceResponse } from "@/util/api/api_responses";
import { LectureAttendance } from "@prisma/client";

export const GET = withMiddlewares<ClassroomParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Administrator", "Student", "Teacher"], matchUserOrganization: (user, req) => user.userOrgId === req.params.orgId }),
	requireURLParams(["orgId", "classroomId"]),
	validateURLParams(ClassroomParamServerValidator),
	async (req, res) => {
		const { orgId, classroomId } = req.params
		const attendanceArr: LectureAttendance[] = []
		const lectures = await db.lecture.findMany({
			where: {
				lectureClassroomId: classroomId
			}
		})
		const attendancePromises = lectures.map(async (lecture) => {
			const attendance = await db.lectureAttendance.findMany({
				where: {
					lectureId: lecture.lectureId,
					userId: req.user!.userId
				}
			});

			attendanceArr.push(...attendance);
		});

		await Promise.all(attendancePromises);

		res.status(200).json<GetClassroomAttendanceResponse>({
			responseStatus: "SUCCESS",
			attendedLectures: attendanceArr
		});
	}
)
