/*
  Warnings:

  - The primary key for the `QuizResponse` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "QuizResponse" DROP CONSTRAINT "QuizResponse_pkey",
ADD CONSTRAINT "QuizResponse_pkey" PRIMARY KEY ("responseId");

-- CreateTable
CREATE TABLE "Notes" (
    "notesId" TEXT NOT NULL,
    "notesContent" TEXT NOT NULL,
    "notesTitle" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("notesId")
);

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("lectureId") ON DELETE RESTRICT ON UPDATE CASCADE;
