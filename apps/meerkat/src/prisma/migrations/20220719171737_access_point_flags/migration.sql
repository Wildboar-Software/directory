-- AlterTable
ALTER TABLE `AccessPoint` ADD COLUMN `disclose_cross_refs` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `trust_ibra` BOOLEAN NOT NULL DEFAULT false;
