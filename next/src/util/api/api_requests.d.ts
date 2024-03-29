// Write your API Request Types Here

import type {S3Object, User, UserType} from "@prisma/client";
import {S3ObjectMethod} from "@/util/s3/types";

// Use this in place of {}
export type NoParams = {}

export type OrgIdBaseParams = {
	orgId: string
}

export type UserIdBaseParams = {
	userId: string
}

export type GetUserParams = {
	orgId: string,
	userId: string
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

export type CreateUserParams = OrgIdBaseParams & {}
export type CreateUserBody = {
	userName: string,
	userPassword: string,
	userDisplayName: string,
	userType: UserType
}

export type CreateClassroomBody = {
	classroomName : string,
	facultyId: string
}

export type ClassroomParams = {
	orgId: string,
	classroomId: string
}

export type ClassroomQuizParams = {
	orgId: string,
	classroomId: string,
	quizId: string
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

export type CreateTranscriptBody = {
	transcriptText : string
}

export type TranscriptParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	transcriptId: string
}

export type EditTranscriptBody = CreateTranscriptBody

export type TranscriptParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	transcriptId: string
}


export type AttendanceQueryParams = {
	userId: string
}

export type EnrollmentQueryParams = {
	userId: string
}

export type DeleteEnrollmentQueryParams = {
	classroomId: string
}

export type CreateQuizBody = {
	quizName : string
}

export type QuizParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	quizId: string
}

export type ClassQuizIdParams = {
	orgId: string,
	classroomId: string,
	quizId: string
}


export type CreateQuizQuestionBody = {
	questionText: string
	questionOptions: string[]
	questionAnswerIndex: number
}

export type QuizQuestionParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	quizId: string,
	questionId: string
}

export type CreateQuizAttemptBody = {
	attemptTimestamp: string | number | Date
}

export type QuizAttemptParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	quizId: string,
	attemptId: string
}


export type ClassQuizAttemptParams = {
	orgId: string,
	classroomId: string,
	quizId: string,
	attemptId: string
}

export type CreateQuizResponseBody = {
	responseContent: string | null
	responseAccuracy: number
}

export type QuizResponseQueryParams = {
	questionId: string
}

export type CreateNotesBody = {
	notesContent: string
	notesTitle?: string
}

export type NotesParams = {
	orgId: string,
	classroomId: string,
	lectureId: string,
	notesId: string
}

export type EditNotesBody = CreateNotesBody

export type CreateReportTargetBody = {
	reportTargetEmail: string
}

export type ReportTargetParams = {
	reportTargetId: string,
}

export type MediaEndpointRequestBody = S3Object & {
	requestMethod: S3ObjectMethod,
}

export type CreateSingleUserParams = OrgIdBaseParams

export type CreateSingleUserBody = Pick<User, "userType" | "userName" | "userDisplayName" | "userPassword">

export type CreateBulkUserParams = OrgIdBaseParams

export type CreateBulkUserBody = {
	csvData: string
}

export type GetOrgUsersParams = OrgIdBaseParams

export type DeleteUserParams = OrgIdBaseParams & UserIdBaseParams

export type GetTeacherByNameParams = {
	orgId: string,
	name: string
}

export type GetMeetingTokenParams = LectureParams