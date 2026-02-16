-- API Logs Table Migration
-- SAFE: This only ADDS a new table, does not modify existing data

CREATE TABLE IF NOT EXISTS `api_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `timestamp` BIGINT NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `endpoint` VARCHAR(500) NOT NULL,
  `userId` VARCHAR(255) DEFAULT NULL,
  `username` VARCHAR(255) DEFAULT NULL,
  `ipAddress` VARCHAR(45) NOT NULL,
  `userAgent` TEXT DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `statusCode` INT DEFAULT NULL,
  `responseTime` INT DEFAULT NULL,
  `requestBody` TEXT DEFAULT NULL,
  `responseError` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_timestamp` (`timestamp`),
  INDEX `idx_userId` (`userId`),
  INDEX `idx_endpoint` (`endpoint`(255)),
  INDEX `idx_ipAddress` (`ipAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
