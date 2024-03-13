-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Student', 'Teacher', 'Administrator');

-- CreateEnum
CREATE TYPE "S3RequestMethod" AS ENUM ('GET', 'PUT', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "userOrgId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userDisplayName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "ReportTarget" (
    "reportTargetID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "reportTargetEmail" TEXT NOT NULL,

    CONSTRAINT "ReportTarget_pkey" PRIMARY KEY ("userID","reportTargetID")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "classroomID" TEXT NOT NULL,
    "classroomName" TEXT NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("classroomID")
);

-- CreateTable
CREATE TABLE "ClassroomEnrollment" (
    "userID" TEXT NOT NULL,
    "classroomID" TEXT NOT NULL,

    CONSTRAINT "ClassroomEnrollment_pkey" PRIMARY KEY ("userID","classroomID")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "lectureID" TEXT NOT NULL,
    "lectureStartTimestamp" TIMESTAMP(3) NOT NULL,
    "lectureEndTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("lectureID")
);

-- CreateTable
CREATE TABLE "LectureAttendance" (
    "lectureID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "LectureAttendance_pkey" PRIMARY KEY ("userID","lectureID")
);

-- CreateTable
CREATE TABLE "LectureTranscript" (
    "transcriptID" TEXT NOT NULL,
    "lectureID" TEXT NOT NULL,
    "transcriptText" TEXT NOT NULL,

    CONSTRAINT "LectureTranscript_pkey" PRIMARY KEY ("lectureID","transcriptID")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quizId" TEXT NOT NULL,
    "quizName" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "questionId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionOptions" TEXT[],
    "questionAnswerIndex" INTEGER NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "attemptId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "attemptTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("attemptId")
);

-- CreateTable
CREATE TABLE "QuizResponse" (
    "responseId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "responseContent" TEXT NOT NULL,
    "responseAccuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("attemptId")
);

-- CreateTable
CREATE TABLE "QuizReport" (
    "reportId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,

    CONSTRAINT "QuizReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "S3Object" (
    "objectKey" TEXT NOT NULL,
    "objectFileName" TEXT NOT NULL,
    "objectSizeBytes" INTEGER NOT NULL,
    "objectContentType" TEXT NOT NULL,

    CONSTRAINT "S3Object_pkey" PRIMARY KEY ("objectKey")
);

-- CreateTable
CREATE TABLE "S3Request" (
    "requestId" TEXT NOT NULL,
    "objectKey" TEXT,
    "requestMethod" "S3RequestMethod" NOT NULL,
    "requestUserId" TEXT,

    CONSTRAINT "S3Request_pkey" PRIMARY KEY ("requestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizReport_attemptId_key" ON "QuizReport"("attemptId");

-- AddForeignKey
ALTER TABLE "ReportTarget" ADD CONSTRAINT "ReportTarget_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_classroomID_fkey" FOREIGN KEY ("classroomID") REFERENCES "Classroom"("classroomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureAttendance" ADD CONSTRAINT "LectureAttendance_lectureID_fkey" FOREIGN KEY ("lectureID") REFERENCES "Lecture"("lectureID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureAttendance" ADD CONSTRAINT "LectureAttendance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureTranscript" ADD CONSTRAINT "LectureTranscript_lectureID_fkey" FOREIGN KEY ("lectureID") REFERENCES "Lecture"("lectureID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "QuizQuestion"("questionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("attemptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizReport" ADD CONSTRAINT "QuizReport_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("attemptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Request" ADD CONSTRAINT "S3Request_objectKey_fkey" FOREIGN KEY ("objectKey") REFERENCES "S3Object"("objectKey") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Request" ADD CONSTRAINT "S3Request_requestUserId_fkey" FOREIGN KEY ("requestUserId") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
