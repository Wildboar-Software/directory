/*
  Warnings:

  - The `auth_level_basic_signed` column on the `ACIItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ACIItem" ALTER COLUMN "auth_level_basic_level" DROP NOT NULL,
DROP COLUMN "auth_level_basic_signed",
ADD COLUMN     "auth_level_basic_signed" BOOLEAN;
