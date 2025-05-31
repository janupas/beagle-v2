-- CreateTable
CREATE TABLE `lobbies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `adminId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lobbies` ADD CONSTRAINT `lobbies_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users`(`supabase_uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
