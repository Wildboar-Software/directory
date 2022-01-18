/*
  Warnings:

  - You are about to alter the column `auth_level_other_dir_ref` on the `ACIItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE `ACIItem` MODIFY `auth_level_other_dir_ref` VARCHAR(128) NULL;
