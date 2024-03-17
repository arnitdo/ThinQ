// Write your API Request Types Here

// Use this in place of {}
import type { UserType } from "@prisma/client";

export type NoParams = {}

export type OrgIdBaseParams = {
	orgId: string
}

export type CreateOrganizationBody = {
	orgId: string
	orgName: string
}

export type AuthLoginUserParams = OrgIdBaseParams & {}
export type AuthLoginUserBody = {
	userName: string,
	userPassword: string
}

export type AuthSignupUserParams = OrgIdBaseParams & {}
export type AuthSignupUserBody = {
	userName: string,
	userPassword: string,
	userDisplayName: string,
	userType: UserType
}

export type CreateClassroomBody = {
	classroomName : string
}

export type ClassroomParams = {
	orgId: string,
	classroomId: string
}

export type EditClassroomBody = CreateClassroomBody

export type CreateLectureBody = {
	lectureStartTimestamp : string | number | Date,
	lectureEndTimestamp : string | number | Date,
	title : string,
}

export type EditLectureBody = CreateLectureBody


export type LectureParams = {
	orgId: string,
	classroomId: string,
	lectureId: string
}
