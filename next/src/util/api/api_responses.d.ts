// Write your API Responses here
import type {
	Assessment,
	AssessmentAttempt,
	AssessmentResponse,
	Assignment,
	Classroom,
	ClassroomEnrollment,
	ClassroomResource,
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
export type ClassroomData = {
	classroomId: string,
	classroomName: string,
	facultyUserId: string,
	classroomOrgId: string,
	_count: {
		classroomEnrollments: number
	},
	User:{
			userId: string,
			userDisplayName: string,
	}
}
export type GetClassroomsResponse = {
	classrooms: Classroom[]
}

export type GetClassroomDataResponse = {
	classrooms: ClassroomData[]
}

export type GetClassroomResponse = {
	classroom: Classroom
}

export type GetUserByIdResponse = {
	user: AuthUser
}

export type GetUsersResponse = {
	users: AuthUser[]
}

export type QuizAnalytics = {
	lectureId: string;
    quizId: string;
    quizName: string;
    quizLecture: {
        _count: {
            lectureAttendance: number;
        };
    };
    quizAttempts: {
        attemptTimestamp: Date;
        attemptUser: {
			userDisplayName: string;
			userId: string;
		};
        attemptResponses: QuizResponse[];
    }[];
    quizQuestions: QuizQuestion[];
    _count: {
        quizAttempts:number;
    };

}

export type GetQuizAnalyticsResponse = {
	quizAnalytics: QuizAnalytics
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

export type CreateQuizAttemptResponse = {
	createdQuizAttemptId: string
}

export type GetQuizAttemptResponse = {
	quizAttempt: QuizAttempt
}

export type GetAssessmentAttemptResponse = {
	assessmentAttempt: AssessmentAttempt
}

export type CreateAssessmentAttemptResponse = {
	createdAssessmentAttemptId: string
}


export type GetAssessmentAttemptsResponse = {
	assessmentAttempts: AssessmentAttempt[]
}


export type GetQuizResponsesResponse = {
	quizResponses: QuizResponse[]
}

export type GetAssessmentResponsesResponse = {
	assessmentResponses: AssessmentResponse[]
}

export type GetQuizResponseResponse = {
	quizResponse: QuizResponse
}

export type GetNotesResponse = {
	notes: Notes
}

export type GetAllNotesResponse = {
	notes: Notes[]
}

export type GetAllQuizzesResponse = {
	quizzes: Quiz[]
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

export type GetMeetingTokenResponse = {
	accessToken: string
}

export type GetQuizDataResponse = {
	quizData: {
		quizId: string,
		quizName: string,
		quizQuestions: QuizQuestion[],
		quizAttempts: QuizAttempt[],
		quizLecture: Lecture
	}
}

export type GetCalenderResponse = {
	lectures: {
		lectureId: string,
		title:	string,
		lectureStartTimestamp: Date,
		lectureEndTimestamp: Date,
		lectureClassroom: {
			classroomId: string,
			classroomName: string,
			facultyUserId: string,
			User: {
				userDisplayName: string
			},
			_count: {
				classroomEnrollments: number
			}

		}
	}[]
}

export type CreateClassroomResourceResponse = {
	resourceId: string
}

export type GetClassroomResourcesResponse = {
	classroomResources: (Omit<ClassroomResource, "resourceObjectKey"> & {
		resourceUrl: string
	})[]
}

export type CreateClassroomAssessmentResponse = {
	assessmentId: string
}

export type CreateAssignmentResponse = {
	assignmentId: string
}

export type GetClassroomAssignmentResponse = {
	classroomAssignments: Assignment[]
}

export type GetClassroomAssessmentResponse = {
	classroomAssessment: Assessment
}

export type GetClassroomAssessmentsResponse = {
	classroomAssessment: Assessment[]
}

export type GetAssessmentAttemptResponse = {
	assessmentAttempt: AssessmentAttempt
}

export type GetAssessmentAttemptResponse = {
	sssessmentAttempt: AssessmentAttempt[]
}