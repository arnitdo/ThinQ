"use client"
import type {RequestMethod, ResponseJSON, StatusCode} from "@/util/api/api_meta";

type MakeAPIRequestArgs<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	requestUrl: string,
	requestMethod: RequestMethod,
	urlParams: ParamsT,
	bodyParams: BodyT,
	queryParams: QueryT,
	customHeaders?: Headers
}

type MakeAPIRequestRet<ResponseT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	hasResponse: true,
	hasError: false,
	statusCode: StatusCode,
	responseData: ResponseJSON<ResponseT, ParamsT, BodyT, QueryT>,
	errorData: undefined
} | {
	hasResponse: false,
	hasError: true,
	statusCode: 0,
	responseData: undefined,
	errorData: Error
}

export async function makeAPIRequest<ResponseT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(
	args: MakeAPIRequestArgs<ParamsT, BodyT, QueryT>
): Promise<MakeAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT>> {
	const {requestMethod, requestUrl, urlParams, queryParams, bodyParams, customHeaders = {}} = args

	let resolvedUrl = requestUrl

	for (const paramKey in urlParams){

		const paramValue = urlParams[paramKey]
		// @ts-ignore
		resolvedUrl = resolvedUrl.replace(`:${paramKey}`, paramValue.toString())
		// @ts-ignore
		resolvedUrl = resolvedUrl.replace(`[${paramKey}]`, paramValue.toString())
	}

	const queryParameters = new URLSearchParams(queryParams)
	resolvedUrl = `${resolvedUrl}?${queryParameters.toString()}`

	try {
		const fetchResponse = await fetch(
			resolvedUrl,
			{
				method: requestMethod,
				headers: {
					"Content-Type": "application/json",
					...customHeaders
				},
				...(["GET", "DELETE"].includes(requestMethod) ? {} : {
					body: JSON.stringify(bodyParams)
				})
			}
		)

		const responseJson = await fetchResponse.json() as ResponseJSON<ResponseT, ParamsT, BodyT, QueryT>

		return {
			hasResponse: true,
			hasError: false,
			statusCode: fetchResponse.status as StatusCode,
			responseData: responseJson,
			errorData: undefined
		}
	} catch (e){
		return  {
			hasResponse: false,
			hasError: true,
			statusCode: 0,
			responseData: undefined,
			errorData: e as unknown as Error
		}
	}
}