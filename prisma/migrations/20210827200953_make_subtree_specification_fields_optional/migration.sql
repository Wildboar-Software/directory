-- AlterTable
ALTER TABLE `SubtreeSpecification` MODIFY `base` JSON,
    MODIFY `specific_exclusions` JSON,
    MODIFY `specification_filter` JSON;
