/*
  Warnings:

  - Added the required column `order_index` to the `DistinguishedValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ACIItem` ADD COLUMN `auth_level_other_descriptor` VARCHAR(191) NULL,
    ADD COLUMN `auth_level_other_dir_ref` VARCHAR(191) NULL,
    ADD COLUMN `auth_level_other_encoding` LONGBLOB NULL,
    ADD COLUMN `auth_level_other_encoding_type` INTEGER NULL,
    ADD COLUMN `auth_level_other_indir_ref` INTEGER NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `AccessPoint` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Alias` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `AttributeTypeDescription` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Clearance` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ContentRule` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ContextDescription` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ContextUseRule` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `DITStructureRule` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `DistinguishedValue` ADD COLUMN `order_index` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `EntryAccessControlScheme` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `EntryAdministrativeRole` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `EntryCollectiveExclusion` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `EntryObjectClass` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Friendship` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `MatchingRuleUse` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `NameForm` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ObjectClassDescription` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `SearchRule` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
