-- ====================================================================
-- SKRYPT STRUKTURY BAZY DANYCH DLA CMS TWOJE ODDŁUŻANIE (SEOHOST MYSQL)
-- ====================================================================
-- Możesz zaimportować ten plik w phpMyAdmin na serwerze SEOHOST,
-- lub skorzystać z przycisku "Zainicjalizuj tabele i dane" w panelu /admin.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabela sekcji stron
CREATE TABLE IF NOT EXISTS `cms_sections` (
  `page_slug` varchar(64) NOT NULL,
  `section_key` varchar(64) NOT NULL,
  `content_json` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_slug`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela ustawień globalnych
CREATE TABLE IF NOT EXISTS `cms_settings` (
  `setting_key` varchar(64) NOT NULL,
  `setting_value` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela użytkowników panelu admina (opcjonalna)
CREATE TABLE IF NOT EXISTS `cms_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(32) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
