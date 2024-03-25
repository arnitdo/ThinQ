import {withMiddlewares} from "@/util/middleware";
import {authParser, requireAuthenticatedUser, requireBodyParams, validateBodyParams} from "@/util/middleware/helpers";
import {getObjectUrl} from "@/util/s3/server";
import {MediaEndpointRequestBody, NoParams} from "@/util/api/api_requests";
import {MediaEndpointResponse} from "@/util/api/api_responses";
import {MediaEndpointBodyServerValidator} from "@/util/validators/server";

export const POST = withMiddlewares<NoParams, MediaEndpointRequestBody, NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireBodyParams(["objectKey", "requestMethod", "objectFileName", "objectContentType", "objectSizeBytes"]),
	validateBodyParams(MediaEndpointBodyServerValidator),
	async (req , res) => {
		const {requestMethod, objectKey, objectFileName, objectSizeBytes, objectContentType} = req.body

		const presignedUrl = await getObjectUrl({
			requestMethod: requestMethod,
			objectKey: objectKey
		})

		return res.status(200).json<MediaEndpointResponse>({
			responseStatus: "SUCCESS",
			objectUrl: presignedUrl
		})
	}
)