/*
  Warnings:

  - Added the required column `ber` to the `AccessPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessPoint" ADD COLUMN     "ber" BYTEA NOT NULL,
ALTER COLUMN "ipv4" DROP NOT NULL,
ALTER COLUMN "tcp_port" DROP NOT NULL;
