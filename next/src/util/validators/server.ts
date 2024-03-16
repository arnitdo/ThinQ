import {
	AuthLoginUserBody,
	AuthLoginUserParams,
	AuthSignupUserBody,
	AuthSignupUserParams,
	CreateOrganizationBody,
	OrgIdBaseParams
} from "@/util/api/api_requests";
import {ServerValidator} from "@/util/validators/index";
import db from "@/util/db";
import {IN_ARR, STRLEN_NZ} from "@/util/validators/utils";
import {UserType} from "@prisma/client";

export async function orgExists(orgId: string){
	const orgExists = await db.organization.findFirst({
		where: {
			orgId: orgId
		}
	})

	return orgExists !== null
}

export const CreateOrgBodyServerValidator: ServerValidator<CreateOrganizationBody> = {
	orgId: async (orgId: string) => {
		return !(await orgExists(orgId))
	},
	orgName: async (orgName: string) => {
		const orgExists = await db.organization.findFirst({
			where: {
				orgName: orgName
			}
		})

		return orgExists === null
	}
}

export const BaseOrgIdParamServerValidator: ServerValidator<OrgIdBaseParams> = {
	orgId: orgExists
}

export const AuthLoginUserParamsServerValidator = BaseOrgIdParamServerValidator

export const AuthLoginUserBodyServerValidator: ServerValidator<AuthLoginUserBody, AuthLoginUserParams, AuthLoginUserBody> = {
	userName: async (userName: string, req) => {
		const {orgId} = req.params

		const userExists = await db.user.findFirst({
			where: {
				userOrgId: orgId,
				userName: userName
			}
		})

		return userExists !== null
	},
	// Don't validate password here, hash inside the handler if possible
	userPassword: STRLEN_NZ
}

export const AuthSignupUserParamsServerValidator: ServerValidator<AuthSignupUserParams> = BaseOrgIdParamServerValidator
export const AuthSignupUserBodyServerValidator: ServerValidator<AuthSignupUserBody, AuthSignupUserParams> = {
	userName: async (userName: string, req) => {
		const {orgId} = req.params

		const userExists = await db.user.findFirst({
			where: {
				userOrgId: orgId,
				userName: userName
			}
		})

		return userExists === null
	},
	userType: IN_ARR([UserType.Student, UserType.Teacher, UserType.Administrator]),
	userDisplayName: STRLEN_NZ,
	userPassword: STRLEN_NZ
}