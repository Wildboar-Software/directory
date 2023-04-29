/*
  Warnings:

  - Added the required column `requested_strategy_external_ber` to the `OperationalBinding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OperationalBinding` ADD COLUMN `requested_strategy` ENUM('TOTAL', 'INCREMENTAL', 'EXTERNAL') NULL,
    ADD COLUMN `requested_strategy_external_ber` LONGBLOB NOT NULL;
