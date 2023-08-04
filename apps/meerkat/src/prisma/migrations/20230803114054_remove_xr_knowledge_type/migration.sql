/*
  Warnings:

  - The values [CROSS_REFERENCE] on the enum `AccessPoint_knowledge_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `AccessPoint` MODIFY `knowledge_type` ENUM('MY_ACCESS_POINT', 'SUPERIOR', 'SPECIFIC', 'NON_SPECIFIC', 'SUPPLIER', 'CONSUMER', 'SECONDARY_SUPPLIER', 'SECONDARY_CONSUMER', 'OTHER', 'OB_REQUEST', 'OB_SHADOW_MASTER', 'NON_SUPPLYING_MASTER') NOT NULL;
