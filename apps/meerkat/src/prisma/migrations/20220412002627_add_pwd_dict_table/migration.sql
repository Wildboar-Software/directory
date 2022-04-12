-- CreateTable
CREATE TABLE `PasswordDictionaryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bit` SMALLINT NOT NULL,
    `item` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PasswordDictionaryItem_bit_item_key`(`bit`, `item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
