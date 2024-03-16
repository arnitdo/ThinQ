import {ClientValidator} from "@/util/validators/index";
import {AuthLoginUserBody, AuthSignupUserBody, CreateOrganizationBody} from "@/util/api/api_requests";
import {STRLEN_NZ} from "@/util/validators/utils";

export const CreateOrgClientValidator: ClientValidator<CreateOrganizationBody> = {
	orgId: STRLEN_NZ,
	orgName: STRLEN_NZ
}

export const AuthLoginUserBodyClientValidator: ClientValidator<AuthLoginUserBody> = {
	userName: STRLEN_NZ,
	userPassword: STRLEN_NZ
}

export const AuthSignupUserBodyClientValidator: ClientValidator<AuthSignupUserBody> = {
	userName: STRLEN_NZ,
	userPassword: STRLEN_NZ,
	userType: STRLEN_NZ,
	userDisplayName: STRLEN_NZ
}