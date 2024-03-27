import {withMiddlewares} from "@/util/middleware";
import {GetMeetingTokenParams} from "@/util/api/api_requests";
import {
	authParser,
	requireAuthenticatedUser,
	requireAuthorizedUser,
	requireURLParams,
	validateURLParams
} from "@/util/middleware/helpers";
import {UserType} from "@prisma/client";
import {GetLectureTokenValidator} from "@/util/validators/server";
import {AccessToken} from "livekit-server-sdk"
import {GetLectureTokenResponse} from "@/util/api/api_responses";

export const GET = withMiddlewares<GetMeetingTokenParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({
		matchUserTypes: [UserType.Student, UserType.Teacher]
	}),
	requireURLParams(["orgId", "classroomId", "lectureId"]),
	validateURLParams(GetLectureTokenValidator),
	async (req, res) => {
		const {lectureId, classroomId, orgId} = req.params

		const accessToken = new AccessToken(
			process.env.LIVEKIT_API_KEY,
			process.env.LIVEKIT_API_SECRET,
			{
				identity: req.user!.userId,
				name: req.user!.userDisplayName,
				metadata: JSON.stringify({
					lectureId, classroomId, orgId
				})
			}
		);

		accessToken.addGrant({
			room: lectureId,
			roomJoin: true,
			canPublish: true,
			roomAdmin: (req.user!.userType === UserType.Teacher),
			canSubscribe: true
		})

		const tokenString = await accessToken.toJwt()

		res.status(200).json<GetLectureTokenResponse>({
			responseStatus: "SUCCESS",
			accessToken: tokenString
		})
	}
)