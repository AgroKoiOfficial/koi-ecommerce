/*
  Warnings:

  - You are about to drop the column `cartId` on the `checkouts` table. All the data in the column will be lost.
  - Added the required column `cart` to the `checkouts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_cartId_fkey`;

-- AlterTable
ALTER TABLE `checkouts` DROP COLUMN `cartId`,
    ADD COLUMN `cart` JSON NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `checkoutId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_checkoutId_fkey` FOREIGN KEY (`checkoutId`) REFERENCES `checkouts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
