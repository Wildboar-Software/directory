/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `AttributeTypeDescription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `ContextDescription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[anchor]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[oid]` on the table `NameForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `ObjectClassDescription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `NetworkServiceAccessPoint` MODIFY `tcp_port` INTEGER;

-- CreateTable
CREATE TABLE `NamedObjectIdentifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(128) NOT NULL,

    INDEX `NamedObjectIdentifier.name_index`(`name`),
    UNIQUE INDEX `NamedObjectIdentifier.oid_unique`(`oid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AttributeTypeDescription.identifier_unique` ON `AttributeTypeDescription`(`identifier`);

-- CreateIndex
CREATE UNIQUE INDEX `ContextDescription.identifier_unique` ON `ContextDescription`(`identifier`);

-- CreateIndex
CREATE UNIQUE INDEX `Friendship.anchor_unique` ON `Friendship`(`anchor`);

-- CreateIndex
CREATE UNIQUE INDEX `NameForm.oid_unique` ON `NameForm`(`oid`);

-- CreateIndex
CREATE UNIQUE INDEX `ObjectClassDescription.identifier_unique` ON `ObjectClassDescription`(`identifier`);
