-- Add password reset columns to users table
ALTER TABLE `users`
ADD COLUMN `resetToken` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `resetTokenExpire` BIGINT(20) DEFAULT NULL;
