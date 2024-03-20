import {withMiddlewares} from "@/util/middleware";
import {AUTH_COOKIE_NAME, COOKIE_OPTS, EPOCH_DATE_FMT} from "@/util/constants";

export const POST = withMiddlewares(
	async (req, res) => {
		res.setHeader("Set-Cookie", `${AUTH_COOKIE_NAME}=; expires=${EPOCH_DATE_FMT}; ${COOKIE_OPTS}`)
		res.status(200).json({
			responseStatus: "SUCCESS"
		})
	}
)