import { withMiddlewares } from "@/util/middleware";
import { NoParams } from "@/util/api/api_requests";
import { authParser, requireAuthenticatedUser, requireAuthorizedUser } from "@/util/middleware/helpers";
import db from "@/util/db";
import { GetQuizAttemptsResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares<NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireAuthorizedUser({ matchUserTypes: ["Student"] }),
	async (req, res) => {

		const quizAttempts = await db.quizAttempt.findMany({
			where: {
				userId: req.user!.userId
			}
		})

		res.status(200).json<GetQuizAttemptsResponse>({
			responseStatus: "SUCCESS",
			quizAttempts: quizAttempts
		})
	}
)
