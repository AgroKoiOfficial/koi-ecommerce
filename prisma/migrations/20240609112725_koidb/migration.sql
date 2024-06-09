/*
  Warnings:

  - You are about to drop the column `discount` on the `coupons` table. All the data in the column will be lost.
  - Added the required column `discountType` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupons` DROP COLUMN `discount`,
    ADD COLUMN `decimalValue` DECIMAL(10, 2) NULL,
    ADD COLUMN `discountType` ENUM('DECIMAL', 'PERCENT') NOT NULL,
    ADD COLUMN `percentValue` DECIMAL(5, 2) NULL;
