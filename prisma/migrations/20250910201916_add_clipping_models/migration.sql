-- CreateTable
CREATE TABLE `clippings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `banner_image` VARCHAR(500) NULL,
    `content` LONGTEXT NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_by` VARCHAR(100) NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `clippings_created_by_idx`(`created_by`),
    INDEX `clippings_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clipping_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clipping_id` INTEGER NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `url` VARCHAR(500) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `clipping_news_clipping_id_idx`(`clipping_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clippings` ADD CONSTRAINT `clippings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clipping_news` ADD CONSTRAINT `clipping_news_clipping_id_fkey` FOREIGN KEY (`clipping_id`) REFERENCES `clippings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
