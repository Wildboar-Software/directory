-- CreateTable
CREATE TABLE `PendingShadowIncrementalStepRefresh` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `binding_identifier` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ber` LONGBLOB NOT NULL,
    `submitted` BOOLEAN NOT NULL DEFAULT false,
    `acknowledged` BOOLEAN NOT NULL DEFAULT false,
    `rename` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('OTHER', 'ADD', 'REMOVE', 'MODIFY', 'MULTI') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
