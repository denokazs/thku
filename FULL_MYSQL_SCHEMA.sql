-- FULL MYSQL SCHEMA EXPORT FOR THKU.COM.TR
-- Generated on 2026-02-13
-- Includes:
-- 1. Base schema from schema.sql
-- 2. Fixes from fix_schema_cpanel.sql (BIGINTs, new columns)
-- 3. Programmatic fixes from scripts/fix_db_schema.js
-- 4. Latest manual fixes (logoBackground)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `clubId` bigint(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `studentId` varchar(50) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE IF NOT EXISTS `clubs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `logoBackground` varchar(255) DEFAULT 'from-red-600 to-orange-600',
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
  `clubId` bigint(20) DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) NOT NULL,
  `clubId` bigint(20) DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `clubId` bigint(20) DEFAULT NULL,
  `studentId` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `joinedAt` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `club_admins`
--

CREATE TABLE IF NOT EXISTS `club_admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `clubId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
