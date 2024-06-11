/*
  Warnings:

  - You are about to alter the column `total` on the `checkouts` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `checkouts` MODIFY `total` INTEGER NOT NULL;
