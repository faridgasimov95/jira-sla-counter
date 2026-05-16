/*
  Warnings:

  - Added the required column `size` to the `SavedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedFile" ADD COLUMN     "size" INTEGER NOT NULL;
