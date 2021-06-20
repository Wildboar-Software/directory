/*
  Warnings:

  - The `type` column on the `ContextValue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `fallback` to the `ContextValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContextValue" ADD COLUMN     "fallback" BOOLEAN NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER[];
