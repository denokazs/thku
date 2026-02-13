
-- Add missing columns to 'clubs' table
-- Run this in phpMyAdmin SQL tab

ALTER TABLE `clubs` 
ADD COLUMN `displayOrder` int(11) DEFAULT 9999 AFTER `isActive`,
ADD COLUMN `isOfficial` tinyint(1) DEFAULT 0 AFTER `displayOrder`;
