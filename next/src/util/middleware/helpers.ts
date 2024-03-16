import {APIHandler} from "@/util/middleware/index";
import {MaamRequest} from "@/util/api/api_meta";
import {UserType} from "@prisma/client";
import {AuthUser} from "@/util/middleware/auth";
import {AUTH_COOKIE_NAME, FALLBACK_JWT_SECRET} from "@/util/constants";
import jwt from "jsonwebtoken"
import {ServerValidator} from "@/util/validators";

export function authParser(): APIHandler {
	return (req, res) => {
		const authCookie = req.cookies.get(AUTH_COOKIE_NAME)
		if (authCookie === undefined){
			req.user = undefined
		} else {
			const cookieValue = authCookie.value

			try {
				const cookieData = jwt.verify(cookieValue, process.env.JWT_SECRET || FALLBACK_JWT_SECRET)
				req.user = cookieData as AuthUser
			} catch (e) {
				console.error("JWT Error: ", e)
				// Do nothing, authentication is not a requirement at times
			}
		}
	}
}

export function requireAuthenticatedUser(): APIHandler {
	return (req, res) => {
		if (req.user === undefined){
			res.status(401).json({
				responseStatus: "ERR_UNAUTHENTICATED"
			})
		} else {
			// User is authenticated
		}
	}
}

type RequireAuthorizedUserArgs<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	matchUserTypes: UserType[],
	matchUserOrganization?: (user: AuthUser, req: MaamRequest<ParamsT, BodyT, QueryT>) => (Promise<boolean> | boolean)
}

export function requireAuthorizedUser<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(args: RequireAuthorizedUserArgs<ParamsT, BodyT, QueryT>): APIHandler<ParamsT, BodyT, QueryT> {
	const {matchUserTypes, matchUserOrganization} = args
	return async (req, res) => {
		if (req.user === undefined){
			res.status(401).json({
				responseStatus: "ERR_UNAUTHENTICATED"
			})
			return
		} else {
			const {
				userId, userType, userOrgId
			} = req.user

			if (matchUserTypes.length === 0 || !matchUserTypes.includes(userType)){
				res.status(403).json({
					responseStatus: "ERR_UNAUTHORIZED"
				})
				return
			}

			if (matchUserOrganization){
				const userOrgMatches = await matchUserOrganization(req.user, req)
				if (!userOrgMatches){
					res.status(403).json({
						responseStatus: "ERR_UNAUTHORIZED"
					})
					return
				}
			}
		}
	}
}

export function requireURLParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(urlParams: (keyof ParamsT)[]): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const missingParams: (keyof ParamsT)[] = []
		const requestParams = Object.keys(req.params) as (keyof ParamsT)[]
		for (const requiredParam of urlParams){
			if (!requestParams.includes(requiredParam)){
				missingParams.push(requiredParam)
			}
		}

		if (missingParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_MISSING_URL_PARAMS",
				missingParams: missingParams
			})
		}
	}
}

export function requireBodyParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(bodyParams: (keyof BodyT)[]): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const missingParams: (keyof BodyT)[] = []
		const requestParams = Object.keys(req.body) as (keyof BodyT)[]
		for (const requiredParam of bodyParams){
			if (!requestParams.includes(requiredParam)){
				missingParams.push(requiredParam)
			}
		}

		if (missingParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_MISSING_BODY_PARAMS",
				missingParams: missingParams
			})
		}
	}
}

export function requireQueryParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(queryParams: (keyof QueryT)[]): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const missingParams: (keyof QueryT)[] = []
		const requestParams = Object.keys(req.query) as (keyof QueryT)[]
		for (const requiredParam of queryParams){
			if (!requestParams.includes(requiredParam)){
				missingParams.push(requiredParam)
			}
		}

		if (missingParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_MISSING_QUERY_PARAMS",
				missingParams: missingParams
			})
		}
	}
}

export function validateURLParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(paramValidators: ServerValidator<ParamsT, ParamsT, BodyT, QueryT>): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const invalidParams: (keyof ParamsT)[] = []
		const paramsToValidate = Object.keys(paramValidators) as (keyof ParamsT)[]
		for (const paramToValidate of paramsToValidate){
			const validatorFunction = paramValidators[paramToValidate]
			const paramValue = req.params[paramToValidate]
			if (validatorFunction === undefined){
				// Do nothing, don't need to validate this!
			} else {
				const validationResult = await validatorFunction(paramValue, req)
				if (validationResult === false){
					invalidParams.push(paramToValidate)
				}
			}
		}

		if (invalidParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_INVALID_URL_PARAMS",
				invalidParams: invalidParams
			})
		}
	}
}

export function validateBodyParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(paramValidators: ServerValidator<BodyT, ParamsT, BodyT, QueryT>): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const invalidParams: (keyof BodyT)[] = []
		const paramsToValidate = Object.keys(paramValidators) as (keyof BodyT)[]
		for (const paramToValidate of paramsToValidate){
			const validatorFunction = paramValidators[paramToValidate]
			const paramValue = req.body[paramToValidate]
			if (validatorFunction === undefined){
				// Do nothing, don't need to validate this!
			} else {
				const validationResult = await validatorFunction(paramValue, req)
				if (validationResult === false){
					invalidParams.push(paramToValidate)
				}
			}
		}

		if (invalidParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_INVALID_BODY_PARAMS",
				invalidParams: invalidParams
			})
		}
	}
}

export function validateQueryParams<ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(paramValidators: ServerValidator<QueryT, ParamsT, BodyT, QueryT>): APIHandler<ParamsT, BodyT, QueryT> {
	return async function (req, res){
		const invalidParams: (keyof QueryT)[] = []
		const paramsToValidate = Object.keys(paramValidators) as (keyof QueryT)[]
		for (const paramToValidate of paramsToValidate){
			const validatorFunction = paramValidators[paramToValidate]
			const paramValue = req.query[paramToValidate]
			if (validatorFunction === undefined){
				// Do nothing, don't need to validate this!
			} else {
				const validationResult = await validatorFunction(paramValue, req)
				if (validationResult === false){
					invalidParams.push(paramToValidate)
				}
			}
		}

		if (invalidParams.length > 0){
			res.status(400).json({
				responseStatus: "ERR_INVALID_QUERY_PARAMS",
				invalidParams: invalidParams
			})
		}
	}
}