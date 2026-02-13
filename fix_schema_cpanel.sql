
-- 1. Fix Club IDs (Max Int Issue)
ALTER TABLE `clubs` MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE `users` MODIFY `clubId` BIGINT DEFAULT NULL;
ALTER TABLE `members` MODIFY `clubId` BIGINT DEFAULT NULL;
ALTER TABLE `events` MODIFY `clubId` BIGINT DEFAULT NULL;
ALTER TABLE `messages` MODIFY `clubId` BIGINT DEFAULT NULL;

-- 2. Fix other tables ID overflow
ALTER TABLE `members` MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE `announcements` MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT;

-- 3. Fix join date column name (Ignore error if column does not exist or is already named joinedAt)
-- Attempt to rename if it exists as joinDate
ALTER TABLE `members` CHANGE `joinDate` `joinedAt` varchar(50) DEFAULT NULL;

-- 4. Add missing columns for Member Application (Reason, Department, Avatar)
ALTER TABLE `members` ADD COLUMN `reason` text DEFAULT NULL;
ALTER TABLE `members` ADD COLUMN `department` varchar(255) DEFAULT NULL;
ALTER TABLE `members` ADD COLUMN `avatar` varchar(255) DEFAULT NULL;

-- 5. Create future admin table
CREATE TABLE IF NOT EXISTS `club_admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `clubId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
