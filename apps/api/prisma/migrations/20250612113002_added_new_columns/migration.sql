/*
  Warnings:

  - Added the required column `type` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `type` TEXT NOT NULL,
    MODIFY `created_at` TEXT NOT NULL;
