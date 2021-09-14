/*
  Warnings:

  - You are about to alter the column `sort_key` on the `AttributeValue` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedBigInt`.

*/
-- AlterTable
ALTER TABLE `AttributeValue` MODIFY `sort_key` BIGINT UNSIGNED;
