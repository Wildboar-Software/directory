/*
  Warnings:

  - You are about to drop the column `ber` on the `NetworkServiceAccessPoint` table. All the data in the column will be lost.
  - Added the required column `bytes` to the `NetworkServiceAccessPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NetworkServiceAccessPoint" DROP COLUMN "ber",
ADD COLUMN     "bytes" BYTEA NOT NULL;
