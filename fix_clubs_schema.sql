
-- Fix ID overflow and JSON storage limits
-- Run this in phpMyAdmin SQL tab

ALTER TABLE `clubs` 
MODIFY COLUMN `id` bigint(20) NOT NULL AUTO_INCREMENT,
MODIFY COLUMN `president` longtext DEFAULT NULL,
MODIFY COLUMN `gallery` longtext DEFAULT NULL,
MODIFY COLUMN `badges` longtext DEFAULT NULL,
MODIFY COLUMN `socialMedia` longtext DEFAULT NULL;
