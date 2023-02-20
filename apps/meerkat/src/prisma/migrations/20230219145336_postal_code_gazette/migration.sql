-- CreateTable
CREATE TABLE `PostalCodesGazetteEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `c2c` CHAR(2) NOT NULL,
    `c3c` CHAR(3) NOT NULL,
    `c3n` INTEGER NOT NULL,
    `st` VARCHAR(191) NOT NULL,
    `locality_1` VARCHAR(191) NOT NULL,
    `locality_2` VARCHAR(191) NULL,
    `locality_3` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostalCodeBoundaryPoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postal_code_id` INTEGER NOT NULL,
    `northing` INTEGER NOT NULL,
    `easting` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostalCodeBoundaryPoints` ADD CONSTRAINT `PostalCodeBoundaryPoints_postal_code_id_fkey` FOREIGN KEY (`postal_code_id`) REFERENCES `PostalCodesGazetteEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
