import {withMiddlewares} from "@/util/middleware";

const default404Handler = withMiddlewares(
	(req, res) => {
		res.status(404).json({
			responseStatus: "ERR_NOT_FOUND"
		})
	}
)

export {
	default404Handler as GET,
	default404Handler as POST,
	default404Handler as PUT,
	default404Handler as DELETE,
	default404Handler as PATCH,
	default404Handler as HEAD,
	default404Handler as OPTIONS
}