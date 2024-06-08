/*
  Warnings:

  - You are about to drop the `_carttoproduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_carttoproduct` DROP FOREIGN KEY `_CartToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_carttoproduct` DROP FOREIGN KEY `_CartToProduct_B_fkey`;

-- AlterTable
ALTER TABLE `carts` ADD COLUMN `productId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_carttoproduct`;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
