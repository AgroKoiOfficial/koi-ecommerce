/*
  Warnings:

  - Added the required column `shippingId` to the `checkouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `checkouts` ADD COLUMN `shippingId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `checkouts` ADD CONSTRAINT `checkouts_shippingId_fkey` FOREIGN KEY (`shippingId`) REFERENCES `shippings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
