-- AlterTable
ALTER TABLE `ObjectClassDescription` MODIFY `subclassOf` VARCHAR(191),
    MODIFY `mandatories` VARCHAR(191),
    MODIFY `optionals` VARCHAR(191);
