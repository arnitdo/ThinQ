/*
  Warnings:

  - Added the required column `facultyUserId` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lectureClassroomId` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "facultyUserId" TEXT NOT NULL,
ADD COLUMN     "lectureClassroomId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_facultyUserId_fkey" FOREIGN KEY ("facultyUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_lectureClassroomId_fkey" FOREIGN KEY ("lectureClassroomId") REFERENCES "Classroom"("classroomId") ON DELETE RESTRICT ON UPDATE CASCADE;
