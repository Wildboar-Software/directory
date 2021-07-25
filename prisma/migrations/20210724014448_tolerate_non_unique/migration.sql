/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `OperationalBinding` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Entry.immediate_superior_id_rdn_unique";

-- CreateIndex
CREATE UNIQUE INDEX "OperationalBinding.uuid_unique" ON "OperationalBinding"("uuid");
