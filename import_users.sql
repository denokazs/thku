-- 1. Ensure columns exist (Ignore errors if columns already exist)
ALTER TABLE `users` ADD COLUMN `resetToken` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `resetTokenExpire` BIGINT(20) DEFAULT NULL;

-- 2. Clear existing users to prevent duplicates (Optional: Remove if you want to keep existing)
TRUNCATE TABLE `users`;

-- 3. Insert production data
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `clubId`, `email`, `phone`, `studentId`, `department`, `createdAt`) VALUES
('1', 'admin', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'super_admin', NULL, NULL, NULL, NULL, NULL, NULL),
('1770405154516', 'deniz', '$2b$10$aYdAAlEG2CZKRrFkZsmyNOw3tDsi3CVHhuZYuXkRVt8jnSyegfpFq', 'Deniz Kazmacı', 'super_admin', NULL, 'kazmacideniz@gmail.com', '05382533330', '250445013', NULL, '2026-02-06T19:12:34.516Z'),
('1770408827052', 'ies', '$2b$10$8NT2OR0xJcWtfmnh4gZRWuRdYoXtFySJQIfBBRfdqYDsDRu5JZgQW', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
('2', 'robotics', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
('3', 'siber', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 2, NULL, NULL, 38, NULL, NULL),
('denosbir', 'denosbir', '$2b$10$OvoR6r5xV0PkGnhFyAYmEukeRsYblUaISQnyeXIq3Ea8wZ6vm4hcm', 'deniz kazmacı', 'club_admin', 1, 'denosbir@gmail.com', '05382533330', '', NULL, NULL),
('verify-1770742182216', 'verify_user_1770742182216', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:42.216Z'),
('verify-1770742199144', 'verify_user_1770742199144', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:59.144Z');