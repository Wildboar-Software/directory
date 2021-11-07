-- DropForeignKey
ALTER TABLE `ACIItem` DROP FOREIGN KEY `ACIItem_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `Alias` DROP FOREIGN KEY `Alias_alias_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `AttributeValue` DROP FOREIGN KEY `AttributeValue_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `Clearance` DROP FOREIGN KEY `Clearance_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `ContentRule` DROP FOREIGN KEY `ContentRule_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `ContextUseRule` DROP FOREIGN KEY `ContextUseRule_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `ContextValue` DROP FOREIGN KEY `ContextValue_value_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryAccessControlScheme` DROP FOREIGN KEY `EntryAccessControlScheme_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryAdministrativeRole` DROP FOREIGN KEY `EntryAdministrativeRole_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryCollectiveExclusion` DROP FOREIGN KEY `EntryCollectiveExclusion_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryObjectClass` DROP FOREIGN KEY `EntryObjectClass_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `Friendship` DROP FOREIGN KEY `Friendship_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `MatchingRuleUse` DROP FOREIGN KEY `MatchingRuleUse_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `NetworkServiceAccessPoint` DROP FOREIGN KEY `NetworkServiceAccessPoint_access_point_id_fkey`;

-- DropForeignKey
ALTER TABLE `NoDictionaryWords` DROP FOREIGN KEY `NoDictionaryWords_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `NoGeographicalNames` DROP FOREIGN KEY `NoGeographicalNames_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `NoPersonNames` DROP FOREIGN KEY `NoPersonNames_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `NonSpecificKnowledge` DROP FOREIGN KEY `NonSpecificKnowledge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `Password` DROP FOREIGN KEY `Password_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdChangeAllowed` DROP FOREIGN KEY `PwdChangeAllowed_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdDictionaries` DROP FOREIGN KEY `PwdDictionaries_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdExpiryAge` DROP FOREIGN KEY `PwdExpiryAge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdExpiryWarning` DROP FOREIGN KEY `PwdExpiryWarning_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdFailureDuration` DROP FOREIGN KEY `PwdFailureDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdGraces` DROP FOREIGN KEY `PwdGraces_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdHistorySlots` DROP FOREIGN KEY `PwdHistorySlots_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdLockoutDuration` DROP FOREIGN KEY `PwdLockoutDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxAge` DROP FOREIGN KEY `PwdMaxAge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxFailures` DROP FOREIGN KEY `PwdMaxFailures_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxTimeInHistory` DROP FOREIGN KEY `PwdMaxTimeInHistory_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinLength` DROP FOREIGN KEY `PwdMinLength_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinTimeInHistory` DROP FOREIGN KEY `PwdMinTimeInHistory_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdModifyEntryAllowed` DROP FOREIGN KEY `PwdModifyEntryAllowed_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdRecentlyExpiredDuration` DROP FOREIGN KEY `PwdRecentlyExpiredDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `RDN` DROP FOREIGN KEY `RDN_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `SearchRule` DROP FOREIGN KEY `SearchRule_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `SubtreeSpecification` DROP FOREIGN KEY `SubtreeSpecification_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `UniqueIdentifier` DROP FOREIGN KEY `UniqueIdentifier_entry_id_fkey`;

-- AddForeignKey
ALTER TABLE `UniqueIdentifier` ADD CONSTRAINT `UniqueIdentifier_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Password` ADD CONSTRAINT `Password_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdModifyEntryAllowed` ADD CONSTRAINT `PwdModifyEntryAllowed_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdChangeAllowed` ADD CONSTRAINT `PwdChangeAllowed_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxAge` ADD CONSTRAINT `PwdMaxAge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryAge` ADD CONSTRAINT `PwdExpiryAge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinLength` ADD CONSTRAINT `PwdMinLength_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoDictionaryWords` ADD CONSTRAINT `NoDictionaryWords_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoPersonNames` ADD CONSTRAINT `NoPersonNames_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoGeographicalNames` ADD CONSTRAINT `NoGeographicalNames_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdDictionaries` ADD CONSTRAINT `PwdDictionaries_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryWarning` ADD CONSTRAINT `PwdExpiryWarning_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdGraces` ADD CONSTRAINT `PwdGraces_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdFailureDuration` ADD CONSTRAINT `PwdFailureDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdLockoutDuration` ADD CONSTRAINT `PwdLockoutDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxFailures` ADD CONSTRAINT `PwdMaxFailures_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxTimeInHistory` ADD CONSTRAINT `PwdMaxTimeInHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinTimeInHistory` ADD CONSTRAINT `PwdMinTimeInHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdHistorySlots` ADD CONSTRAINT `PwdHistorySlots_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdRecentlyExpiredDuration` ADD CONSTRAINT `PwdRecentlyExpiredDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD CONSTRAINT `AttributeValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD CONSTRAINT `ContextValue_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `AttributeValue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ACIItem` ADD CONSTRAINT `ACIItem_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clearance` ADD CONSTRAINT `Clearance_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkServiceAccessPoint` ADD CONSTRAINT `NetworkServiceAccessPoint_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NonSpecificKnowledge` ADD CONSTRAINT `NonSpecificKnowledge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubtreeSpecification` ADD CONSTRAINT `SubtreeSpecification_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentRule` ADD CONSTRAINT `ContentRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextUseRule` ADD CONSTRAINT `ContextUseRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingRuleUse` ADD CONSTRAINT `MatchingRuleUse_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SearchRule` ADD CONSTRAINT `SearchRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RDN` ADD CONSTRAINT `RDN_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryObjectClass` ADD CONSTRAINT `EntryObjectClass_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_alias_entry_id_fkey` FOREIGN KEY (`alias_entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAdministrativeRole` ADD CONSTRAINT `EntryAdministrativeRole_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryCollectiveExclusion` ADD CONSTRAINT `EntryCollectiveExclusion_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAccessControlScheme` ADD CONSTRAINT `EntryAccessControlScheme_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
