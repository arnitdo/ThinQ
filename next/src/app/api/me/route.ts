import { withMiddlewares } from "@/util/middleware";
import { authParser } from "@/util/middleware/helpers";
import { GetUserResponse } from "@/util/api/api_responses";
import {AUTH_COOKIE_NAME, COOKIE_OPTS, EPOCH_DATE_FMT} from "@/util/constants";

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

export const DELETE = withMiddlewares(
	async (req, res) => {
		res.setHeader("Set-Cookie", `${AUTH_COOKIE_NAME}=; expires=${EPOCH_DATE_FMT}; ${COOKIE_OPTS}`)
		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)