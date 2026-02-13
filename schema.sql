-- Database Schema for thku.com.tr
-- Import this file into your MariaDB/MySQL database via phpMyAdmin

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `clubId` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `studentId` varchar(50) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `clubId`, `email`, `phone`, `studentId`, `department`, `createdAt`) VALUES
('1', 'admin', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'super_admin', NULL, NULL, NULL, NULL, NULL, NULL),
('1770405154516', 'deniz', '$2b$10$aYdAAlEG2CZKRrFkZsmyNOw3tDsi3CVHhuZYuXkRVt8jnSyegfpFq', 'Deniz Kazmacı', 'super_admin', NULL, 'kazmacideniz@gmail.com', '05382533330', '250445013', NULL, '2026-02-06T19:12:34.516Z'),
('1770408827052', 'ies', '$2b$10$8NT2OR0xJcWtfmnh4gZRWuRdYoXtFySJQIfBBRfdqYDsDRu5JZgQW', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
('2', 'robotics', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
('3', 'siber', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 2, NULL, NULL, 38, NULL, NULL),
('denosbir', 'denosbir', '$2b$10$OvoR6r5xV0PkGnhFyAYmEukeRsYblUaISQnyeXIq3Ea8wZ6vm4hcm', 'deniz kazmacı', 'club_admin', 1, 'denosbir@gmail.com', '05382533330', '', NULL, NULL),
('verify-1770742182216', 'verify_user_1770742182216', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:42.216Z'),
('verify-1770742199144', 'verify_user_1770742199144', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:59.144Z');

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE IF NOT EXISTS `clubs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `leader` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `members` int(11) DEFAULT 0,
  `displayOrder` int(11) DEFAULT 9999,
  `foundedYear` int(11) DEFAULT NULL,
  `longDescription` text DEFAULT NULL,
  `meetingDay` varchar(255) DEFAULT NULL,
  `meetingLocation` varchar(255) DEFAULT NULL,
  `president` text DEFAULT NULL,
  `gallery` text DEFAULT NULL,
  `badges` text DEFAULT NULL,
  `socialMedia` text DEFAULT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `name`, `description`, `slug`, `category`, `logo`, `coverImage`, `members`, `foundedYear`, `longDescription`, `meetingDay`, `meetingLocation`, `president`, `gallery`, `badges`, `createdAt`) VALUES
(1, 'THKU Robotics Club 2', 'Robotik ve yapay zeka alanında projeler geliştiren teknoloji kulübü !!!!!!!!!!!!!!!!!!1', 'robotics', 'teknoloji', '/uploads/google-mlexp24l.png', '/uploads/Gemini_Generated_Image_qza9lcqza9lcqza9-mlevvqri.png', 0, 2020, '9uyrjkgmfödvcx e49gurwtoıjkfc regıqohfdn resvgeedfve', 'Salı ve Perşembe', 'Konferans Salonu', '{\"avatar\":\"👤\",\"name\":\"Başkan aaaa\",\"email\":\"waoejrfauwrfhj@gmail.com\"}', '[{\"id\":1770625762493,\"url\":\"/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlewv273.png\",\"caption\":\"Green Minimal Matcha Advertisement Social Media Post.png\"},{\"id\":1770625802511,\"url\":\"/uploads/Ekran_Resmi_2020-12-08_13.15.21-mlewvx2g.png\",\"caption\":\"Ekran Resmi 2020-12-08 13.15.21.png\"},{\"id\":1770625805013,\"url\":\"/uploads/Idari_Bina-mlewvz13.jpg\",\"caption\":\"İdari_Bina.jpg\"}]', '[]', NULL),
(2, 'Siber Güvenlik Topluluğu', 'Siber güvenlik farkındalığı ve CTF yarışmaları', 'siber', 'teknoloji', NULL, NULL, 0, 2021, NULL, NULL, NULL, '{}', '{}', '[]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `clubId` int(11) DEFAULT NULL,
  `clubName` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `capacity` varchar(50) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `schedule` text DEFAULT NULL,
  `speakers` text DEFAULT NULL,
  `faq` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `registrationLink` varchar(255) DEFAULT NULL,
  `attendees` int(11) DEFAULT 0,
  `isPast` tinyint(1) DEFAULT 0,
  `isFeatured` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `time`, `location`, `description`, `coverImage`, `clubId`, `clubName`, `category`, `capacity`, `images`, `schedule`, `speakers`, `faq`, `requirements`, `registrationLink`, `attendees`, `isPast`, `isFeatured`) VALUES
(1770408979125, 'reguhwewjdaks', '2026-02-28', '04:20', 'konferans salonu', 'ergfewsdawsQERGFEDW', '/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlbc9zu4.png', 1, 'THKU Robotics Club', 'Konferans', NULL, '[\"/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlbca2iy.png\",\"/uploads/selami_1445522539-mlbca6hh.jpg\"]', '[{\"time\":\"23:17\",\"title\":\"wreafwdRGWFE\"},{\"time\":\"04:15\",\"title\":\"WREGFQWDRGWFE\"}]', '[{\"name\":\"selami BAYEĞ\",\"title\":\"sr. gırjıger\",\"company\":\"fdwersjfıj holding\",\"image\":\"/uploads/selami_1445522539-mlbbs95k.jpg\"}]', '[{\"question\":\"soru\",\"answer\":\"cevap\"}]', 'ejfmdkwqnsafkjwe erguıfesdaıuhfıuw 4gfeıuıuhfıuwedhfwehr weıofjgwıoejf\nfejıowejfıowejf', '', 1, 0, 0),
(1770633807064, 'deneme başlık', '2026-02-20', '18:46', 'Gazi, Cumhurbaşkanlığı Blv, 06560 Yenimahalle/Ankara', '55oegrıofwwjhfodıuwq açıklama', '/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlf29ro0.png', 1, 'THKU Robotics Club 2', 'Eğlence', '1', '[\"/uploads/Idari_Bina-mlf29y7u.jpg\",\"/uploads/Ekran_Resmi_2020-12-08_13.15.21-mlf2a2m7.png\"]', '[{\"time\":\"13:44\",\"title\":\"aaaaaaaaa\"},{\"time\":\"17:47\",\"title\":\"trevfdcwsxaz\"}]', '[{\"name\":\"ad soyad\",\"title\":\"asasdasd ünvan\",\"company\":\"ladeka ltd\",\"image\":\"/uploads/selami_1445522539-mlf1n1g2.jpg\"}]', '[{\"question\":\"soru\",\"answer\":\"cevap\"}]', 'ku3khgnterjnkwqm gereksinim', '', 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE IF NOT EXISTS `news` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `facultyId` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `date`, `image`, `summary`, `category`, `content`, `facultyId`) VALUES
(1770751421546, 'rjnefdvnjkvn', '22 ekim 2025', '/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlgzo67z.png', 'reıogvfjdwsajvıfjrwd', NULL, NULL, NULL),
(1770751679553, 'ı5j4ygerkfndgs', '22 ekim 2025', '/uploads/Green_Minimal_Matcha_Advertisement_Social_Media_Post-mlgztv5z.png', '5o4gurthekufghdkue', 'Duyuru', 'h4utıergwmösda', 'aero');

-- --------------------------------------------------------

--
-- Table structure for table `confessions`
--

CREATE TABLE IF NOT EXISTS `confessions` (
  `id` bigint(20) NOT NULL,
  `text` text DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `dislikes` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT 'pending',
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `confessions`
--

INSERT INTO `confessions` (`id`, `text`, `user`, `type`, `likes`, `dislikes`, `status`, `timestamp`) VALUES
(1770411593793, 'sarışın kız bul beni', 'pilotrıwjgıjgf', 'romance', 1, 0, 'approved', 1770411593793),
(1770708515232, 'Mat 123 çıkmışları olan var mı', 'çılgın42', 'question', 1, 0, 'approved', 1770708515232);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) NOT NULL,
  `confessionId` bigint(20) DEFAULT NULL,
  `parentCommentId` bigint(20) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT 'pending',
  `timestamp` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `confessionId`, `parentCommentId`, `text`, `user`, `likes`, `status`, `timestamp`) VALUES
(1770204271824, 1770199203203, NULL, 'adı çağla mı', 'asadasass', 4, 'approved', 1770204271824),
(1770205259262, 1770199203203, NULL, 'eveet', 'fnwejfjwer', 2, 'approved', 1770205259262),
(1770206101120, 1770199203203, 1770204271824, '@asadasass aaa bn mii', 'çağla', 1, 'approved', 1770206101120),
(1770411645407, 1770411593793, NULL, 'instagramım: @jrfwhgf', 'pilot2', 2, 'approved', 1770411645407),
(1770708708006, 1770708515232, NULL, 'Sitenin çıkmış sınavlar kısmında mevcut', 'hayaletadam54', 0, 'rejected', 1770708708006),
(1770708743979, 1770708515232, NULL, 'Sitenin çıkmış sınavlar kısmında mevcut', 'wemdkfmewrm', 1, 'approved', 1770708743979),
(1770708772150, 1770708515232, 1770708743979, '@wemdkfmewrm kralsın', 'frwedovgfkrdmwse', 0, 'approved', 1770708772150),
(1770999999999, 1770199203203, 1770204271824, '@asadasass aynen öyle', 'PilotAli', 2, 'approved', 1770999999999);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) NOT NULL,
  `clubId` int(11) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `senderName` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'sent',
  `priority` varchar(50) DEFAULT 'medium',
  `readAt` varchar(100) DEFAULT NULL,
  `answeredAt` varchar(100) DEFAULT NULL,
  `response` text DEFAULT NULL,
  `internalNotes` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `clubId`, `userId`, `senderName`, `subject`, `topic`, `content`, `createdAt`, `status`, `priority`, `readAt`, `answeredAt`, `response`, `internalNotes`) VALUES
(1770405015636, 5, '1770404913363', 'Deniz Kazmacı', 'şşşş', 'Soru', 'gterfdwsa?', '2026-02-06T19:10:15.636Z', 'sent', 'medium', NULL, NULL, NULL, '[]'),
(1770406835981, 1, '1770405154516', 'Deniz Kazmacı', 'adadsaşdasşdşasş', 'Öneri', 'tqerhqgfdsyrwth5gert4rwfq', '2026-02-06T19:40:35.982Z', 'closed', 'medium', '2026-02-06T19:53:57.728Z', '2026-02-06T19:53:51.125Z', 'mrwtrehb2rth2thr', '[]'),
(1770407915270, 1, '1770405154516', 'Deniz Kazmacı', 'tg4refdwsa', 'İşbirliği', 'y5htg4refwdsq', '2026-02-06T19:58:35.270Z', 'resolved', 'medium', '2026-02-06T19:59:03.736Z', '2026-02-06T19:59:09.548Z', 'tbevgrjkfcwdlös', '[]'),
(1770411191521, 1, '1770405154516', 'Deniz Kazmacı', 'ıuhrıgefukjwrngf', 'Öneri', 'rughweehsguıvfjwrısd', '2026-02-06T20:53:11.521Z', 'resolved', 'medium', '2026-02-06T20:55:02.609Z', '2026-02-06T20:55:07.490Z', 'Teşekkürler, ilgileniyoruz.', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

CREATE TABLE IF NOT EXISTS `forum_posts` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `authorName` varchar(255) DEFAULT NULL,
  `authorAvatar` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `likes` text DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'approved',
  `createdAt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `forum_posts`
--

INSERT INTO `forum_posts` (`id`, `userId`, `authorName`, `authorAvatar`, `content`, `image`, `likes`, `comments`, `category`, `status`, `createdAt`) VALUES
('d34c1936-164b-43f5-ba9e-2254bcd96883', '1770405154516', 'Deniz Kazmacı', '👤', 'ytrhegfdsa5yhtrgefds', '', '[]', '[]', 'General', 'approved', '2026-02-07T19:43:43.738Z');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `priority` varchar(50) DEFAULT 'normal',
  `color` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE IF NOT EXISTS `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `clubId` int(11) DEFAULT NULL,
  `studentId` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `joinDate` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shuttle_stops`
--

CREATE TABLE IF NOT EXISTS `shuttle_stops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cafeteria_menu`
--

CREATE TABLE IF NOT EXISTS `cafeteria_menu` (
  `date` varchar(50) NOT NULL,
  `soup` varchar(255) DEFAULT NULL,
  `main` varchar(255) DEFAULT NULL,
  `side` varchar(255) DEFAULT NULL,
  `dessert` varchar(255) DEFAULT NULL,
  `calorie` int(11) DEFAULT NULL,
  `protein` int(11) DEFAULT NULL,
  `carbs` int(11) DEFAULT NULL,
  `fat` int(11) DEFAULT NULL,
  `isVegetarian` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`key`, `value`) VALUES
('site_settings', '{\"title\":\"THK Üniversitesi\",\"description\":\"Türk Hava Kurumu Üniversitesi Resmi Web Sitesi\",\"logo\":\"/logo.png\",\"contactEmail\":\"info@thk.edu.tr\"}');

COMMIT;
