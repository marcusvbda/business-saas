-- AlterTable
ALTER TABLE `user` ADD COLUMN `stripeCustomerId` TEXT NULL;

-- CreateTable
CREATE TABLE `subscription` (
    `id` VARCHAR(191) NOT NULL,
    `plan` TEXT NOT NULL,
    `referenceId` TEXT NOT NULL,
    `stripeCustomerId` TEXT NULL,
    `stripeSubscriptionId` TEXT NULL,
    `status` TEXT NULL,
    `periodStart` DATETIME(3) NULL,
    `periodEnd` DATETIME(3) NULL,
    `trialStart` DATETIME(3) NULL,
    `trialEnd` DATETIME(3) NULL,
    `cancelAtPeriodEnd` BOOLEAN NULL DEFAULT false,
    `seats` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
