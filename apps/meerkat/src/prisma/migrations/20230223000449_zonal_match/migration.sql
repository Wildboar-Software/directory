-- CreateTable
CREATE TABLE `PostalCodesGazetteEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `c2c` CHAR(2) NOT NULL,
    `st` VARCHAR(191) NOT NULL,
    `locality` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PostalCodesGazetteEntry_c2c_st_locality_postal_code_key`(`c2c`, `st`, `locality`, `postal_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostalCodeBoundaryPoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postal_code_id` INTEGER NOT NULL,
    `northing` INTEGER NOT NULL,
    `easting` INTEGER NOT NULL,

    INDEX `PostalCodeBoundaryPoints_postal_code_id_idx`(`postal_code_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostalCodeBoundaryPoints` ADD CONSTRAINT `PostalCodeBoundaryPoints_postal_code_id_fkey` FOREIGN KEY (`postal_code_id`) REFERENCES `PostalCodesGazetteEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
