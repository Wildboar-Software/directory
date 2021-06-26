/*
  Warnings:

  - You are about to drop the column `algorithmId` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdEncAlg_id` on the `Password` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "algorithmId",
DROP COLUMN "pwdEncAlg_id",
ALTER COLUMN "algorithm_parameters_der" DROP NOT NULL;
