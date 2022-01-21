-- CreateTable
CREATE TABLE `AccessPointCredentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `access_point_id` INTEGER NOT NULL,
    `simple_name` JSON NULL,
    `simple_password_unprotected` LONGBLOB NULL,
    `simple_password_hash_value` LONGBLOB NULL,
    `simple_password_hash_algorithm_oid` VARCHAR(191) NULL,
    `simple_password_hash_algorithm_parameters` LONGBLOB NULL,
    `strong_pkcs12` LONGBLOB NULL,

    UNIQUE INDEX `AccessPointCredentials_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessPointCredentials` ADD CONSTRAINT `AccessPointCredentials_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
