import type {MaamRequest, MaamResponse, RequestMethod, ResponseJSON, StatusCode} from "@/util/api/api_meta";
import {NextRequest, NextResponse} from "next/server";

type _InternalMiddlewareResponseHelper = {
	hasResponse: boolean,
	responseType: "json" | "redirect" | undefined
	responseHeaders: Headers,
	responseStatus: StatusCode
	responseDataOrURL: any,

}

export type APIHandler<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {}
> = (
	req: MaamRequest<ParamsT, BodyT, QueryT>,
	res: MaamResponse<ParamsT, BodyT, QueryT>
) => Promise<void> | void


// This is the type next actually expects
type _NextHandlerType = (req: NextRequest, params: any) => Promise<any>

export function withMiddlewares<
	ParamsT extends {} = {},
	BodyT extends {} = {},
	QueryT extends {} = {}
>(
	...middlewaresOrHandlers: (APIHandler<ParamsT, BodyT, QueryT>)[]
): _NextHandlerType {
	return async function (req, opts = {}){
		const params = opts.params || {}
		try {
			const maamRequest: MaamRequest<ParamsT, BodyT, QueryT> = {
				url: req.url,
				method: req.method as RequestMethod,
				params: params as ParamsT,
				cookies: req.cookies,
				body: (req.method !== "GET") ?
					((await req.json()) as BodyT) :
					({} as BodyT),
				query: Object.fromEntries(req.nextUrl.searchParams.entries()) as QueryT,
				user: undefined
			}

			let _internal: _InternalMiddlewareResponseHelper = {
				hasResponse: false,
				responseHeaders: new Headers(),
				responseDataOrURL: undefined,
				responseType: undefined,
				responseStatus: 200
			}

			const maamResponse: MaamResponse<ParamsT, BodyT, QueryT> = {
				json: <T extends {}>(data: ResponseJSON<T, ParamsT, BodyT, QueryT>) => {
					if (_internal.hasResponse){
						// Already overwriting data
						throw new Error("Response data already set, make sure you are returning after setting response data!")
					}
					_internal.hasResponse = true
					_internal.responseType = "json"
					_internal.responseDataOrURL = data
				},
				redirect: (url: string) => {
					if (_internal.hasResponse){
						// Already overwriting data
						throw new Error("Response data already set, make sure you are returning after setting response data!")
					}
					_internal.hasResponse = true
					_internal.responseType = "redirect"
					_internal.responseDataOrURL = new URL(url, req.url)
				},
				setHeader: (name: string, value: string) => {
					_internal.responseHeaders.set(name,  value)
					return maamResponse
				},
				status: (code: StatusCode) => {
					_internal.responseStatus = code
					return maamResponse
				}
			}

			// Begin middleware/handler logic

			for (const handlerFn of middlewaresOrHandlers){
				try {
					await handlerFn(maamRequest, maamResponse)
				} catch (e) {
					console.error(e)
					maamResponse.status(500).json({
						responseStatus: "ERR_INTERNAL_ERROR"
					})
				}

				if (_internal.hasResponse){
					if (_internal.responseType === "json"){
						console.log(`${req.method} ${req.url} ${_internal.responseStatus} RESPONSE ${_internal.responseDataOrURL.responseStatus}`)
						return NextResponse.json(
							_internal.responseDataOrURL,
							{
								status: _internal.responseStatus,
								headers: _internal.responseHeaders
							}
						)
					} else if (_internal.responseType === "redirect"){
						console.log(`${req.method} ${req.url} ${_internal.responseStatus} REDIRECT ${_internal.responseDataOrURL}`)
						return NextResponse.redirect(
							_internal.responseDataOrURL as URL
						)
					}
				}
			}


			// End middleware/handler logic
			// If no handler has responded, give an internal error

			console.log(`${req.method} ${req.url} 500 NORESPOND ERR_INTERNAL_ERROR`)
			return NextResponse.json({
				responseStatus: "ERR_INTERNAL_ERROR"
			} satisfies ResponseJSON, {
				status: 500 satisfies StatusCode
			})
		} catch (e){
			console.error(e)
			return NextResponse.json({
				responseStatus: "ERR_INTERNAL_ERROR"
			} satisfies ResponseJSON, {
				status: 500 satisfies StatusCode
			})
		}
	}
}