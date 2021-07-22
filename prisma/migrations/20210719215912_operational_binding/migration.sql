/*
  Warnings:

  - You are about to drop the column `binding_type_id` on the `OperationalBinding` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `OperationalBinding` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `OperationalBinding` table. All the data in the column will be lost.
  - You are about to drop the `OperationalBindingType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `initiator` to the `OperationalBinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiator_ber` to the `OperationalBinding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validity_start` to the `OperationalBinding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OperationalBindingInitiator" AS ENUM ('SYMMETRIC', 'ROLE_A', 'ROLE_B');

-- CreateEnum
CREATE TYPE "ShadowedKnowledgeType" AS ENUM ('MASTER', 'SHADOW', 'BOTH');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Knowledge" ADD VALUE 'OB_REQUEST';
ALTER TYPE "Knowledge" ADD VALUE 'OB_SHADOW_MASTER';

-- DropForeignKey
ALTER TABLE "OperationalBinding" DROP CONSTRAINT "OperationalBinding_binding_type_id_fkey";

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "commonName" TEXT;

-- AlterTable
ALTER TABLE "OperationalBinding" DROP COLUMN "binding_type_id",
DROP COLUMN "identifier",
DROP COLUMN "version",
ADD COLUMN     "accepted" BOOLEAN,
ADD COLUMN     "binding_identifier" INTEGER,
ADD COLUMN     "binding_type" INTEGER[],
ADD COLUMN     "binding_version" SMALLINT,
ADD COLUMN     "immediate_superior" JSONB,
ADD COLUMN     "initiator" "OperationalBindingInitiator" NOT NULL,
ADD COLUMN     "initiator_ber" BYTEA NOT NULL,
ADD COLUMN     "knowledge_type" "ShadowedKnowledgeType",
ADD COLUMN     "last_problem" SMALLINT,
ADD COLUMN     "last_update" TIMESTAMP(3),
ADD COLUMN     "master_access_point_id" INTEGER,
ADD COLUMN     "new_context_prefix_rdn" JSONB,
ADD COLUMN     "othertimes" BOOLEAN,
ADD COLUMN     "periodic_beginTime" TIMESTAMP(3),
ADD COLUMN     "periodic_updateInterval" INTEGER,
ADD COLUMN     "periodic_windowSize" INTEGER,
ADD COLUMN     "requested_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "responded_time" TIMESTAMP(3),
ADD COLUMN     "secondary_shadows" BOOLEAN,
ADD COLUMN     "security_certification_path" BYTEA,
ADD COLUMN     "security_errorCode" TEXT,
ADD COLUMN     "security_errorProtection" SMALLINT,
ADD COLUMN     "security_name" JSONB,
ADD COLUMN     "security_operationCode" TEXT,
ADD COLUMN     "security_random" BYTEA,
ADD COLUMN     "security_target" SMALLINT,
ADD COLUMN     "security_time" TIMESTAMP(3),
ADD COLUMN     "shadowed_context_prefix" JSONB,
ADD COLUMN     "source_ae_title" JSONB,
ADD COLUMN     "source_ip" INET,
ADD COLUMN     "source_tcp_port" SMALLINT,
ADD COLUMN     "subordinates" BOOLEAN,
ADD COLUMN     "supplier_initiated" BOOLEAN,
ADD COLUMN     "supply_contexts" TEXT[],
ADD COLUMN     "validity_end" TIMESTAMP(3),
ADD COLUMN     "validity_start" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "OperationalBindingType";

-- CreateTable
CREATE TABLE "NonSpecificKnowledge" (
    "id" SERIAL NOT NULL,
    "ber" BYTEA NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NonSpecificKnowledge" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalBinding" ADD FOREIGN KEY ("master_access_point_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
