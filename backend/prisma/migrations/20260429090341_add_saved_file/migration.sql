-- CreateTable
CREATE TABLE "SavedFile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "filedata" BYTEA NOT NULL,

    CONSTRAINT "SavedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedFile_userId_key" ON "SavedFile"("userId");

-- AddForeignKey
ALTER TABLE "SavedFile" ADD CONSTRAINT "SavedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
