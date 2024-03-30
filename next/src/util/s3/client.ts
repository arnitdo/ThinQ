import {S3RequestMethod} from "@prisma/client";
import {makeAPIRequest} from "@/util/client/helpers";
import {MediaEndpointResponse} from "@/util/api/api_responses";
import {MediaEndpointRequestBody, NoParams} from "@/util/api/api_requests";

type ManageMediaArgs = {
	mediaFiles: File[],
	requestMethod: S3RequestMethod
	objectKeyGenerator: (file: File, idx: number) => string,
}

type ManageMediaSingleRet = {
	objectKey: string,
	objectUrl: string,
	mediaSuccess: boolean
}

type ManageMediaRet = ManageMediaSingleRet[]

export async function manageMedia(args: ManageMediaArgs): Promise<ManageMediaRet> {
	const {mediaFiles, objectKeyGenerator, requestMethod} = args

	const mediaRets = await Promise.all(
		mediaFiles.map(async (mediaFile, mediaIdx): Promise<ManageMediaSingleRet> => {
			const objectKey = objectKeyGenerator(mediaFile, mediaIdx)

			const urlReq = await makeAPIRequest<MediaEndpointResponse, NoParams, MediaEndpointRequestBody>({
				requestMethod: "POST",
				requestUrl: "/api/media",
				bodyParams: {
					objectKey: objectKey,
					requestMethod: requestMethod,
					objectFileName: mediaFile.name,
					objectContentType: mediaFile.type,
					objectSizeBytes: mediaFile.size
				},
				urlParams: {},
				queryParams: {}
			})

			if (urlReq.hasError){
				return {
					objectKey: objectKey,
					objectUrl: "",
					mediaSuccess: false
				}
			}

			const {responseData} = urlReq

			if (responseData.responseStatus !== "SUCCESS"){
				return {
					objectKey: objectKey,
					objectUrl: "",
					mediaSuccess: false
				}
			}

			const {objectUrl} = responseData

			try {
				const s3Response = await fetch(
					objectUrl,
					{
						method: requestMethod,
						body: mediaFile,
						headers: {
							"Content-Type": mediaFile.type
						}
					}
				)

				if (s3Response.ok){
					return {
						objectKey: objectKey,
						objectUrl: objectUrl,
						mediaSuccess: true
					}
				}

				return {
					objectKey: objectKey,
					objectUrl: "",
					mediaSuccess: false
				}
			} catch (e) {
				console.error(e)
				return {
					objectKey: objectKey,
					objectUrl: "",
					mediaSuccess: false
				}
			}
		})
	)

	return mediaRets
}