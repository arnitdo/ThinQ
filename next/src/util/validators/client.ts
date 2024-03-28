import {ClientValidator} from "@/util/validators/index";
import {AuthLoginUserBody, ClassroomParams, CreateClassroomBody, CreateLectureBody, CreateOrganizationBody, CreateUserBody} from "@/util/api/api_requests";
import {STRLEN_NZ} from "@/util/validators/utils";

export const CreateOrgClientValidator: ClientValidator<CreateOrganizationBody> = {
	orgId: STRLEN_NZ,
	orgName: STRLEN_NZ
}

export const AuthLoginUserBodyClientValidator: ClientValidator<AuthLoginUserBody> = {
	userName: STRLEN_NZ,
	userPassword: STRLEN_NZ
}

export const CreateUserBodyClientValidator: ClientValidator<CreateUserBody> = {
	userName: STRLEN_NZ,
	userPassword: STRLEN_NZ,
	userType: STRLEN_NZ,
	userDisplayName: STRLEN_NZ
}

export const CreateClassroomBodyClientValidator: ClientValidator<CreateClassroomBody> = {
	classroomName: STRLEN_NZ,
	facultyId: STRLEN_NZ
}

export const CreateEnrollmentBodyClientValidator: ClientValidator<ClassroomParams> = {
	classroomId: STRLEN_NZ
}

export const CreateLectureBodyClientValidator: ClientValidator<CreateLectureBody> = {
	title: STRLEN_NZ,
}