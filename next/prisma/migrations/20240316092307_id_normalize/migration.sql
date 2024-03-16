/*
  Warnings:

  - The primary key for the `Classroom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classroomID` on the `Classroom` table. All the data in the column will be lost.
  - The primary key for the `ClassroomEnrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classroomID` on the `ClassroomEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `ClassroomEnrollment` table. All the data in the column will be lost.
  - The primary key for the `Lecture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lectureID` on the `Lecture` table. All the data in the column will be lost.
  - The primary key for the `LectureAttendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lectureID` on the `LectureAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `LectureAttendance` table. All the data in the column will be lost.
  - The primary key for the `LectureTranscript` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lectureID` on the `LectureTranscript` table. All the data in the column will be lost.
  - You are about to drop the column `transcriptID` on the `LectureTranscript` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `questionID` on the `QuizResponse` table. All the data in the column will be lost.
  - The primary key for the `ReportTarget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reportTargetID` on the `ReportTarget` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `ReportTarget` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `User` table. All the data in the column will be lost.
  - The required column `classroomId` was added to the `Classroom` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `classroomId` to the `ClassroomEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ClassroomEnrollment` table without a default value. This is not possible if the table is not empty.
  - The required column `lectureId` was added to the `Lecture` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lectureId` to the `LectureAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LectureAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lectureId` to the `LectureTranscript` table without a default value. This is not possible if the table is not empty.
  - The required column `transcriptId` was added to the `LectureTranscript` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `QuizResponse` table without a default value. This is not possible if the table is not empty.
  - The required column `reportTargetId` was added to the `ReportTarget` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `ReportTarget` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ClassroomEnrollment" DROP CONSTRAINT "ClassroomEnrollment_classroomID_fkey";

-- DropForeignKey
ALTER TABLE "ClassroomEnrollment" DROP CONSTRAINT "ClassroomEnrollment_userID_fkey";

-- DropForeignKey
ALTER TABLE "LectureAttendance" DROP CONSTRAINT "LectureAttendance_lectureID_fkey";

-- DropForeignKey
ALTER TABLE "LectureAttendance" DROP CONSTRAINT "LectureAttendance_userID_fkey";

-- DropForeignKey
ALTER TABLE "LectureTranscript" DROP CONSTRAINT "LectureTranscript_lectureID_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userID_fkey";

-- DropForeignKey
ALTER TABLE "QuizResponse" DROP CONSTRAINT "QuizResponse_questionID_fkey";

-- DropForeignKey
ALTER TABLE "ReportTarget" DROP CONSTRAINT "ReportTarget_userID_fkey";

-- DropForeignKey
ALTER TABLE "S3Request" DROP CONSTRAINT "S3Request_requestUserId_fkey";

-- AlterTable
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_pkey",
DROP COLUMN "classroomID",
ADD COLUMN     "classroomId" TEXT NOT NULL,
ADD CONSTRAINT "Classroom_pkey" PRIMARY KEY ("classroomId");

-- AlterTable
ALTER TABLE "ClassroomEnrollment" DROP CONSTRAINT "ClassroomEnrollment_pkey",
DROP COLUMN "classroomID",
DROP COLUMN "userID",
ADD COLUMN     "classroomId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "ClassroomEnrollment_pkey" PRIMARY KEY ("userId", "classroomId");

-- AlterTable
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_pkey",
DROP COLUMN "lectureID",
ADD COLUMN     "lectureId" TEXT NOT NULL,
ADD CONSTRAINT "Lecture_pkey" PRIMARY KEY ("lectureId");

-- AlterTable
ALTER TABLE "LectureAttendance" DROP CONSTRAINT "LectureAttendance_pkey",
DROP COLUMN "lectureID",
DROP COLUMN "userID",
ADD COLUMN     "lectureId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "LectureAttendance_pkey" PRIMARY KEY ("userId", "lectureId");

-- AlterTable
ALTER TABLE "LectureTranscript" DROP CONSTRAINT "LectureTranscript_pkey",
DROP COLUMN "lectureID",
DROP COLUMN "transcriptID",
ADD COLUMN     "lectureId" TEXT NOT NULL,
ADD COLUMN     "transcriptId" TEXT NOT NULL,
ADD CONSTRAINT "LectureTranscript_pkey" PRIMARY KEY ("lectureId", "transcriptId");

-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "userID",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuizResponse" DROP COLUMN "questionID",
ADD COLUMN     "questionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReportTarget" DROP CONSTRAINT "ReportTarget_pkey",
DROP COLUMN "reportTargetID",
DROP COLUMN "userID",
ADD COLUMN     "reportTargetId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "ReportTarget_pkey" PRIMARY KEY ("userId", "reportTargetId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userID",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "ReportTarget" ADD CONSTRAINT "ReportTarget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("classroomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureAttendance" ADD CONSTRAINT "LectureAttendance_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("lectureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureAttendance" ADD CONSTRAINT "LectureAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureTranscript" ADD CONSTRAINT "LectureTranscript_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("lectureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("questionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Request" ADD CONSTRAINT "S3Request_requestUserId_fkey" FOREIGN KEY ("requestUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
