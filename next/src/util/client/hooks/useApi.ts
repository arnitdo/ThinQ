"use client"

import type {RequestMethod, ResponseJSON, StatusCode} from "@/util/api/api_meta";
import {useEffect, useState} from "react";
import {makeAPIRequest} from "@/util/client/helpers";

type UseAPIRequestArgs<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	requestUrl: string,
	requestMethod: RequestMethod,
	urlParams: ParamsT,
	bodyParams: BodyT,
	queryParams: QueryT,
	customHeaders?: Headers,
	customDeps?: any[]
}

type UseAPIRequestRet<ResponseT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	isLoading: true
	hasResponse: false,
	hasError: false,
	statusCode: 0,
	responseData: undefined,
	errorData: undefined
} | {
	isLoading: false
	hasResponse: true,
	hasError: false,
	statusCode: StatusCode,
	responseData: ResponseJSON<ResponseT, ParamsT, BodyT, QueryT>,
	errorData: undefined
} | {
	isLoading: false
	hasResponse: false,
	hasError: true,
	statusCode: 0,
	responseData: undefined,
	errorData: Error
}


export function useAPIRequest<ResponseT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(
	args: UseAPIRequestArgs<ParamsT, BodyT, QueryT>
): UseAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT> {
	const {requestUrl, requestMethod, urlParams, queryParams, bodyParams, customHeaders  = {}, customDeps = []} = args

	const [responseState, setResponseState] = useState<UseAPIRequestRet<ResponseT, ParamsT, BodyT, QueryT>>({
		isLoading: true,
		hasResponse: false,
		hasError: false,
		statusCode: 0,
		responseData: undefined,
		errorData: undefined
	})

	const requestDeps = [
		requestUrl,
		requestMethod,
		...(Object.keys(urlParams)),
		...(Object.keys(bodyParams)),
		...(Object.keys(queryParams)),
		...(Object.keys(customHeaders)),
		...(customDeps)
	]

	useEffect(() => {
		const makeRequest = async () => {
			setResponseState((prevState) => {
				return {
					isLoading: true,
					hasResponse: false,
					hasError: false,
					statusCode: 0,
					responseData: undefined,
					errorData: undefined
				}
			})

			const fetchResponse = await makeAPIRequest<ResponseT, ParamsT, BodyT, QueryT>(args)

			setResponseState((prevState) => {
				return {
					isLoading: false,
					...fetchResponse
				}
			})
		}

		makeRequest()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, requestDeps);

	return responseState
}