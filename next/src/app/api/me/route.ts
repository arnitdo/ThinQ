import { withMiddlewares } from "@/util/middleware";
import { authParser } from "@/util/middleware/helpers";
import { GetUserResponse } from "@/util/api/api_responses";

export const GET = withMiddlewares(
	authParser(),
	async (req, res) => {
		if (req.user) {
			res.status(200).json<GetUserResponse>({
				responseStatus: "SUCCESS",
				isAuthenticated: true,
				authenticatedUser: req.user
			})
		} else {
			res.status(200).json<GetUserResponse>({
				responseStatus: "SUCCESS",
				isAuthenticated: false,
				authenticatedUser: null
			})
		}
	}
)