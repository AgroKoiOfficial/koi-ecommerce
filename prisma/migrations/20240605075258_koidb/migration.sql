-- DropForeignKey
ALTER TABLE `checkouts` DROP FOREIGN KEY `checkouts_couponId_fkey`;

-- AlterTable
ALTER TABLE `checkouts` MODIFY `couponId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Carousel` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL DEFAULT 'white',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `checkouts` ADD CONSTRAINT `checkouts_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
