/*
  Warnings:

  - Added the required column `ber` to the `ACIItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `ACIItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ACIScope" AS ENUM ('PRESCRIPTIVE', 'ENTRY', 'SUBENTRY');

-- AlterTable
ALTER TABLE "ACIItem" ADD COLUMN     "ber" BYTEA NOT NULL,
ADD COLUMN     "scope" "ACIScope" NOT NULL;
