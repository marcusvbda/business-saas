-- CreateTable
CREATE TABLE `customInfo` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
