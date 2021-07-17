-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "attribute_completeness" BOOLEAN,
ADD COLUMN     "attribute_values_incomplete" BOOLEAN,
ADD COLUMN     "keep_children_in_database" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subordinate_completeness" BOOLEAN;
