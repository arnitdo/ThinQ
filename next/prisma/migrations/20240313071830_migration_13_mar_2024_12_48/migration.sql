-- CreateTable
CREATE TABLE "Organization" (
    "orgId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("orgId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userOrgId_fkey" FOREIGN KEY ("userOrgId") REFERENCES "Organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
