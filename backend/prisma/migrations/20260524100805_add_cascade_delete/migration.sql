-- DropForeignKey
ALTER TABLE "SavedFile" DROP CONSTRAINT "SavedFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFile" ADD CONSTRAINT "SavedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
