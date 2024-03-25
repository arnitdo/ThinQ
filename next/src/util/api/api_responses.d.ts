// Write your API Responses here
import type {
	Classroom,
	ClassroomEnrollment,
	Lecture,
	LectureAttendance,
	LectureTranscript,
	Notes,
	Organization,
	Quiz,
	QuizAttempt,
	QuizQuestion,
	QuizResponse,
	ReportTarget,
	User
} from "@prisma/client";
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

export type GetTrancriptsResponse = {
	transcripts: LectureTranscript[]
}

export type GetTrancriptResponse = {
	transcript: LectureTranscript
}

export type DeletedTranscriptResponse = {
	deletedTranscript: LectureTranscript
}

export type GetClassroomAttendanceResponse = {
	attendedLectures: LectureAttendance[]
}

export type DeletedAttendanceResponse = {
	deletedAttendance: LectureAttendance
}

export type GetLectureAttendanceResponse = {
	attendedLecture: LectureAttendance
}

export type GetEnrollmentsResponse = {
	enrollments: ClassroomEnrollment[]
}

export type DeletedEnrollmentResponse = {
	deletedEnrollment: ClassroomEnrollment
}

export type GetQuizesResponse = {
	quizes: Quiz[]
}

export type GetQuizResponse = {
	quiz: Quiz
}

export type DeletedQuizResponse = {
	deletedQuiz: Quiz
}

export type GetQuizQuestionsResponse = {
	quizQuestions: QuizQuestion[]
}

export type GetQuizQuestionResponse = {
	quizQuestion: QuizQuestion
}

export type DeletedQuizQuestionResponse = {
	deletedQuizQuestion: QuizQuestion
}

export type GetQuizAttemptsResponse = {
	quizAttempts: QuizAttempt[]
}

export type GetQuizAttemptResponse = {
	quizAttempt: QuizAttempt
}

export type GetQuizResponsesResponse = {
	quizResponses: QuizResponse[]
}

export type GetQuizResponseResponse = {
	quizResponse: QuizResponse
}

export type GetNotesResponse = {
	notes: Notes
}

export type DeletedNotesResponse = {
	deletedNotes: Notes
}

export type GetReportTargetsResponse = {
	reportTargets: ReportTarget[]
}

export type GetReportTargetResponse = {
	reportTarget: ReportTarget
}

export type DeletedReportTargetResponse = {
	deletedReportTarget: ReportTarget
}

export type MediaEndpointResponse = {
	objectUrl: string
}

export type CreateSingleUserResponse = {
	userId: string
}

export type GetOrgUsersResponse = {
	orgUsers: User[]
}