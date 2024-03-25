import {withMiddlewares} from "@/util/middleware";
import {authParser, requireAuthenticatedUser, requireBodyParams, validateBodyParams} from "@/util/middleware/helpers";
import {checkIfS3ObjectExists, getObjectUrl} from "@/util/s3/server";
import {MediaEndpointRequestBody, NoParams} from "@/util/api/api_requests";
import {MediaEndpointResponse} from "@/util/api/api_responses";
import db from "@/util/db";
import {MediaEndpointBodyServerValidator} from "@/util/validators/server";

export const POST = withMiddlewares<NoParams, MediaEndpointRequestBody, NoParams>(
	authParser(),
	requireAuthenticatedUser(),
	requireBodyParams(["objectKey", "requestMethod", "objectFileName", "objectContentType", "objectSizeBytes"]),
	validateBodyParams(MediaEndpointBodyServerValidator),
	async (req , res) => {
		const {requestMethod, objectKey, objectFileName, objectSizeBytes, objectContentType} = req.body

		const s3Request = await db.s3Request.create({
			data: {
				objectKey: objectKey,
				requestMethod: requestMethod,
				requestUserId: req.user!.userId,
			}
		})

		const objectExists = await checkIfS3ObjectExists({
			objectKey, objectFileName, objectSizeBytes, objectContentType
		})

		if (!objectExists){
			// Getting / Deleting a non-existent object
			if (requestMethod === "GET" || requestMethod === "DELETE"){
				return res.status(400).json({
					responseStatus: "ERR_INVALID_BODY_PARAMS",
					invalidParams: ["objectKey"]
				})
			}
		}

		const presignedUrl = await getObjectUrl({
			requestMethod: "PUT",
			objectKey: objectKey
		})

		return res.status(200).json<MediaEndpointResponse>({
			responseStatus: "SUCCESS",
			objectUrl: presignedUrl,
			requestId: s3Request.requestId
		})
	}
)