/*
  Warnings:

  - You are about to drop the column `algorithm_id` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the `Algorithm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `algorithm_parameters_der` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_algorithm_id_fkey";

-- AlterTable
ALTER TABLE "Password" DROP COLUMN "algorithm_id",
ADD COLUMN     "algorithmId" INTEGER,
ADD COLUMN     "algorithm_oid" INTEGER[],
ADD COLUMN     "algorithm_parameters_der" BYTEA NOT NULL;

-- DropTable
DROP TABLE "Algorithm";
