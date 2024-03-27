"use client"
import type {RequestMethod, ResponseJSON, StatusCode} from "@/util/api/api_meta";
import {toast} from "sonner";
import {
	AuthLoginUserParams,
	ClassroomParams,
	GetUserParams,
	LectureParams,
	NoParams,
	OrgIdBaseParams
} from "../api/api_requests";
import {
	DeletedLectureResponse,
	GetClassroomsResponse,
	GetEnrollmentsResponse,
	GetLecturesResponse,
	GetUserByIdResponse,
	GetUsersResponse
} from "../api/api_responses";

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
	const { requestMethod, requestUrl, urlParams, queryParams, bodyParams, customHeaders = {} } = args

	let resolvedUrl = requestUrl

	for (const paramKey in urlParams) {

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
		if (responseJson.responseStatus === "ERR_INVALID_BODY_PARAMS" || responseJson.responseStatus === "ERR_INVALID_URL_PARAMS" || responseJson.responseStatus === "ERR_INVALID_QUERY_PARAMS") {
			toast.error("Invalid Fields: " + ((responseJson.invalidParams.length > 1) ? responseJson.invalidParams.join(", ") : responseJson.invalidParams[0]).toString())
		}
		if (responseJson.responseStatus === "ERR_MISSING_BODY_PARAMS" || responseJson.responseStatus === "ERR_MISSING_QUERY_PARAMS" || responseJson.responseStatus === "ERR_MISSING_URL_PARAMS") {
			toast.error("Invalid Fields: " + ((responseJson.missingParams.length > 1) ? responseJson.missingParams.join(", ") : responseJson.missingParams[0]).toString())
		}
		if (responseJson.responseStatus === "ERR_NOT_FOUND") {
			toast.error("Not found!")
		}
		if (responseJson.responseStatus === "ERR_UNAUTHENTICATED") {
			toast.error("Authentication Failed!")
		}
		if (responseJson.responseStatus === "ERR_UNAUTHORIZED") {
			toast.error("Authorization Failed!")
		}
		return {
			hasResponse: true,
			hasError: false,
			statusCode: fetchResponse.status as StatusCode,
			responseData: responseJson,
			errorData: undefined
		}
	} catch (e) {
		const errorData = e as unknown as Error
		toast.error(errorData.message)
		return {
			hasResponse: false,
			hasError: true,
			statusCode: 0,
			responseData: undefined,
			errorData: errorData
		}
	}
}

export async function logout() {
	const response = await makeAPIRequest<ResponseJSON, {}, {}, {}>({
		requestUrl: "/api/me",
		urlParams: {},
		bodyParams: {},
		queryParams: {},
		requestMethod: "DELETE"
	})
	if(response.hasError){
		toast.error("Error signing out!")
		return false;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		toast.success("Signed out successfully!")
		return true;
	}
}

export async function getClassrooms(orgId:string) {
	const response = await makeAPIRequest<GetClassroomsResponse, AuthLoginUserParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/classroom/",
		urlParams: {
			orgId: orgId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.classrooms;
	}
}

export async function getFaculty(orgId:string, userId:string) {
	const response = await makeAPIRequest<GetUserByIdResponse, GetUserParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/users/:userId",
		urlParams: {
			orgId: orgId,
			userId: userId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.user;
	}
}

export async function getEnrollments(orgId:string, classroomId:string) {
	const response = await makeAPIRequest<GetEnrollmentsResponse, ClassroomParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/classroom/:classroomId/enroll",
		urlParams: {
			orgId: orgId,
			classroomId: classroomId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.enrollments;
	}
}

export async function getTeachers(orgId:string) {
	const response = await makeAPIRequest<GetUsersResponse, OrgIdBaseParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/teachers",
		urlParams: {
			orgId: orgId,
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.users;
	}
}

export async function getStudents(orgId:string) {
	const response = await makeAPIRequest<GetUsersResponse, OrgIdBaseParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/students",
		urlParams: {
			orgId: orgId,
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.users;
	}
}

export async function deleteClassroom(orgId:string, classroomId:string) {
	const response = await makeAPIRequest<ResponseJSON, ClassroomParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/classroom/:classroomId",
		urlParams: {
			orgId: orgId,
			classroomId: classroomId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "DELETE"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.responseStatus;
	}
}

export async function deleteUser(orgId:string, userId:string) {
	const response = await makeAPIRequest<ResponseJSON, GetUserParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/users/:userId",
		urlParams: {
			orgId: orgId,
			userId: userId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "DELETE"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.responseStatus;
	}
}

export async function getEnrolledClassrooms() {
	const response = await makeAPIRequest<GetClassroomsResponse, NoParams, NoParams, NoParams>({
		requestUrl: "/api/me/enrollments/",
		urlParams: {
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.classrooms;
	}
}

export async function getFacultyClassrooms(orgId:string) {
	const response = await makeAPIRequest<GetClassroomsResponse, OrgIdBaseParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/teachers/classrooms",
		urlParams: {
			orgId: orgId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.classrooms;
	}
}

export async function getFacultyStudents(orgId:string) {
	const response = await makeAPIRequest<GetUsersResponse, OrgIdBaseParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/teachers/students",
		urlParams: {
			orgId: orgId,
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.users;
	}
}

export async function getLectures(orgId:string, classroomId:string) {
	const response = await makeAPIRequest<GetLecturesResponse, ClassroomParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/classroom/:classroomId/rooms",
		urlParams: {
			orgId,
			classroomId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "GET"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.lectures;
	}
}

export async function deleteLecture(orgId:string, classroomId:string, lectureId:string) {
	const response = await makeAPIRequest<DeletedLectureResponse, LectureParams, NoParams, NoParams>({
		requestUrl: "/api/orgs/:orgId/classroom/:classroomId/rooms/:lectureId",
		urlParams: {
			orgId,
			classroomId,
			lectureId
		},
		bodyParams: {},
		queryParams: {},
		requestMethod: "DELETE"
	})
	if(response.hasError){
		toast.error("Error fetching data!")
		return null;
	}
	if(response.responseData.responseStatus==="SUCCESS"){
		// toast.success("Signed out successfully!")
		return response.responseData.deletedLecture;
	}
}