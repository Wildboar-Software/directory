/*
  Warnings:

  - A unique constraint covering the columns `[previous_id]` on the table `OperationalBinding` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Knowledge" ADD VALUE 'NON_SUPPLYING_MASTER';

-- AlterTable
ALTER TABLE "OperationalBinding" ADD COLUMN     "previous_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "OperationalBinding.previous_id_unique" ON "OperationalBinding"("previous_id");

-- AddForeignKey
ALTER TABLE "OperationalBinding" ADD FOREIGN KEY ("previous_id") REFERENCES "OperationalBinding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
