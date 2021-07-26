/*
  Warnings:

  - You are about to drop the column `ipv4` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `tcp_port` on the `AccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `AccessPoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[immediate_superior_id,rdn]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outbound` to the `OperationalBinding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessPoint" DROP COLUMN "ipv4",
DROP COLUMN "tcp_port",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "OperationalBinding" ADD COLUMN     "outbound" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "NetworkServiceAccessPoint" (
    "id" SERIAL NOT NULL,
    "ipv4" INET,
    "tcp_port" SMALLINT,
    "url" TEXT,
    "ber" BYTEA NOT NULL,
    "access_point_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry.immediate_superior_id_rdn_unique" ON "Entry"("immediate_superior_id", "rdn");

-- AddForeignKey
ALTER TABLE "NetworkServiceAccessPoint" ADD FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
