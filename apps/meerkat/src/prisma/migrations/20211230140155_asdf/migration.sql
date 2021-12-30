/*
  Warnings:

  - You are about to drop the column `query_uuid` on the `EnqueuedSearchResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[connection_uuid,query_ref,result_index]` on the table `EnqueuedSearchResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `query_ref` to the `EnqueuedSearchResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `EnqueuedSearchResult_connection_uuid_query_uuid_result_index_key` ON `EnqueuedSearchResult`;

-- AlterTable
ALTER TABLE `EnqueuedSearchResult` DROP COLUMN `query_uuid`,
    ADD COLUMN `query_ref` VARCHAR(40) NOT NULL,
    MODIFY `entry_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EnqueuedSearchResult_connection_uuid_query_ref_result_index_key` ON `EnqueuedSearchResult`(`connection_uuid`, `query_ref`, `result_index`);
