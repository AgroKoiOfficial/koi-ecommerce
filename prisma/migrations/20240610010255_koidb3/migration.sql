/*
  Warnings:

  - Added the required column `addressId` to the `checkouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `checkouts` ADD COLUMN `addressId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `minimumPrice` DECIMAL(10, 2) NULL;

-- AddForeignKey
ALTER TABLE `checkouts` ADD CONSTRAINT `checkouts_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
