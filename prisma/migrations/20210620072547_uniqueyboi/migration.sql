/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `DIT` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entryUUID]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `DIT` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "DIT" ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "aliased_entry_dn" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DIT.uuid_unique" ON "DIT"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Entry.entryUUID_unique" ON "Entry"("entryUUID");

-- CreateIndex
CREATE INDEX "Entry.dit_id_index" ON "Entry"("dit_id");
