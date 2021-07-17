/*
  Warnings:

  - Added the required column `entry_id` to the `AccessPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessPoint" ADD COLUMN     "entry_id" INTEGER NOT NULL,
ADD COLUMN     "is_consumer_of_id" INTEGER,
ADD COLUMN     "url" TEXT;

-- CreateTable
CREATE TABLE "SubtreeSpecification" (
    "id" SERIAL NOT NULL,
    "base" JSONB NOT NULL,
    "specific_exclusions" JSONB NOT NULL,
    "minimum" INTEGER NOT NULL DEFAULT 0,
    "maximum" INTEGER,
    "specification_filter" JSONB NOT NULL,
    "ber" BYTEA NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DitBridgeKnowledge" (
    "id" SERIAL NOT NULL,
    "domain_local_id" TEXT NOT NULL,
    "ber" BYTEA NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD FOREIGN KEY ("is_consumer_of_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubtreeSpecification" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DitBridgeKnowledge" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
