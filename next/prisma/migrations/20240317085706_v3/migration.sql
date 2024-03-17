/*
  Warnings:

  - Added the required column `classroomOrgId` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "classroomOrgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_classroomOrgId_fkey" FOREIGN KEY ("classroomOrgId") REFERENCES "Organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
