/*
  Warnings:

  - You are about to drop the column `is_family_child` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `is_family_parent` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `last_problem` on the `OperationalBinding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "is_family_child",
DROP COLUMN "is_family_parent";

-- AlterTable
ALTER TABLE "OperationalBinding" DROP COLUMN "last_problem",
ADD COLUMN     "last_ob_problem" SMALLINT,
ADD COLUMN     "last_shadow_problem" SMALLINT,
ADD COLUMN     "source_attr_cert_path" BYTEA,
ADD COLUMN     "source_bind_token" BYTEA,
ADD COLUMN     "source_certificate_path" BYTEA,
ADD COLUMN     "source_credentials_type" SMALLINT,
ADD COLUMN     "source_strong_name" JSONB,
ADD COLUMN     "terminated_time" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "WhitelistedOperationalBinding" (
    "id" SERIAL NOT NULL,
    "binding_type" INTEGER[],
    "initiator" "OperationalBindingInitiator",
    "min_validity_start" TIMESTAMP(3),
    "max_validity_end" TIMESTAMP(3),
    "hostnames" TEXT[],
    "subnet" INET,
    "permitted" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);
