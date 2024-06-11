/*
  Warnings:

  - You are about to alter the column `total` on the `checkouts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `checkouts` MODIFY `total` BIGINT NOT NULL;
