import type {NextRequest} from "next/server";
import type {AuthUser} from "@/util/auth";

type StatusCode = 200 | 400 | 401 | 403 | 404 | 500
export type ResponseStatus = ResponseJSON["responseStatus"]

// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods
export type RequestMethod = "GET" | "PUT" | "POST" | "DELETE" | "PATCH"  | "HEAD"  | "OPTIONS"

export interface MaamRequest<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> {
	url: string
	method: RequestMethod,
	body: BodyT,
	params: ParamsT,
	query: QueryT,
	cookies: NextRequest["cookies"],
	user?: AuthUser
}

// Type fuckery

export type ResponseJSON<ResponseT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = ({
	responseStatus: "SUCCESS"
} 	& ResponseT) | {
	responseStatus: "ERR_INTERNAL_ERROR"
}	| {
	responseStatus: "ERR_NOT_FOUND"
} 	| {
	responseStatus: "ERR_UNAUTHORIZED"
}	| {
	responseStatus: "ERR_UNAUTHENTICATED"
}	| {
	responseStatus: "ERR_INVALID_URL_PARAMS",
	invalidParams: (keyof ParamsT)[]
}	| {
	responseStatus: "ERR_INVALID_BODY_PARAMS",
	invalidParams: (keyof BodyT)[]
}	| {
	responseStatus: "ERR_INVALID_QUERY_PARAMS",
	invalidParams: (keyof QueryT)[]
} 	| {
	responseStatus: "ERR_MISSING_URL_PARAMS",
	missingParams: (keyof ParamsT)[]
}	| {
	responseStatus: "ERR_MISSING_BODY_PARAMS",
	missingParams: (keyof BodyT)[]
}	| {
	responseStatus: "ERR_MISSING_QUERY_PARAMS",
	missingParams: (keyof QueryT)[]
}

interface MaamResponse<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> {
	setHeader: (name: string, value: string) => MaamResponse<ParamsT, BodyT, QueryT>
	json: <T extends {} = {}>(data: ResponseJSON<T, ParamsT, BodyT, QueryT>) => void,
	redirect: (url: string) => void,
	status: (code: StatusCode) => MaamResponse<ParamsT, BodyT, QueryT>
}

