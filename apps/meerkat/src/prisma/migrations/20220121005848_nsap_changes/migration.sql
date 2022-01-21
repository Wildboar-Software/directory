/*
  Warnings:

  - You are about to drop the column `ipv4` on the `NetworkServiceAccessPoint` table. All the data in the column will be lost.
  - You are about to drop the column `tcp_port` on the `NetworkServiceAccessPoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AccessPointCredentials` ADD COLUMN `mtls_client_pkcs12` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `NetworkServiceAccessPoint` DROP COLUMN `ipv4`,
    DROP COLUMN `tcp_port`,
    ADD COLUMN `port` INTEGER NULL;
