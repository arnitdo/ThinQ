import {APIHandler} from "@/util/middleware/index";

export function requireAuthenticatedUser(): APIHandler {
	return (req, res) => {
		if (req.user === undefined){
			res.status(401).json({
				responseStatus: "ERR_UNAUTHENTICATED"
			})
		} else {
			console.log(req.user)
			// Not doing anything passes the request to the next middleware
		}
	}
}