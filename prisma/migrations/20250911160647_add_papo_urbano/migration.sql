-- CreateTable
CREATE TABLE `papo_urbano` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `edition_number` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `month` VARCHAR(20) NOT NULL,
    `year` INTEGER NOT NULL,
    `cover_image` VARCHAR(500) NOT NULL,
    `main_image` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `interview_title` VARCHAR(255) NULL,
    `interview_person` VARCHAR(255) NULL,
    `interview_quote` TEXT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_by` VARCHAR(100) NOT NULL DEFAULT 'admin',
    `created_by_user_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `papo_urbano_edition_number_key`(`edition_number`),
    INDEX `papo_urbano_edition_number_idx`(`edition_number`),
    INDEX `papo_urbano_year_idx`(`year`),
    INDEX `papo_urbano_month_idx`(`month`),
    INDEX `papo_urbano_is_published_idx`(`is_published`),
    INDEX `papo_urbano_created_by_idx`(`created_by`),
    INDEX `papo_urbano_created_by_user_id_idx`(`created_by_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `papo_urbano` ADD CONSTRAINT `papo_urbano_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
