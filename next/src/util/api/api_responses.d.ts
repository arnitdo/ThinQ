// Write your API Responses here
import type {Classroom, Lecture, Organization} from "@prisma/client";
import {AuthUser} from "@/util/middleware/auth";

export type GetOrgsResponse = {
	allOrgs: Organization[]
}

export type GetUserResponse = {
	isAuthenticated: true,
	authenticatedUser: AuthUser
} | {
	isAuthenticated: false,
	authenticatedUser: null
}

export type AuthSignupUserResponse = {} & AuthUser

export type GetClassroomsResponse = {
	classrooms: Classroom[]
}

export type GetClassroomResponse = {
	classroom: Classroom
}

export type DeletedClassroomResponse = {
	deletedClassroom: Classroom
}

export type GetLecturesResponse = {
	lectures: Lecture[]
}

export type GetLectureResponse = {
	lecture: Lecture
}

export type DeletedLectureResponse = {
	deletedLecture: Lecture
}