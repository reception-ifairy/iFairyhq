-- iFairy Studio schema (MariaDB/MySQL)
-- Target DB: admin_ifairycouk
-- Note: uses backticks for reserved words (e.g., `lead`, `key`)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ADMIN / IDENTITY
CREATE TABLE `admin_user` (
  `id` CHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(64) NOT NULL DEFAULT 'founder',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `admin_auth_provider` (
  `id` CHAR(36) NOT NULL,
  `admin_id` CHAR(36) NOT NULL,
  `provider` VARCHAR(64) NOT NULL,
  `provider_user_id` VARCHAR(255) NOT NULL,
  `provider_email` VARCHAR(255) DEFAULT NULL,
  `access_token` TEXT DEFAULT NULL,
  `refresh_token` TEXT DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `scopes` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_provider_user` (`provider`, `provider_user_id`),
  KEY `idx_auth_admin` (`admin_id`),
  CONSTRAINT `fk_auth_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `api_credential` (
  `id` CHAR(36) NOT NULL,
  `admin_id` CHAR(36) NOT NULL,
  `service` VARCHAR(64) NOT NULL,
  `label` VARCHAR(255) DEFAULT NULL,
  `api_key` TEXT NOT NULL,
  `metadata` JSON DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_api_admin` (`admin_id`),
  CONSTRAINT `fk_api_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- PRODUCTS / BOTS / TOOLS
CREATE TABLE `product` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_product_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bot` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `model` VARCHAR(128) DEFAULT NULL,
  `prompt` TEXT DEFAULT NULL,
  `temperature` DECIMAL(3,2) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_bot_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tool` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `endpoint` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_tool_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `product_bot` (
  `product_id` CHAR(36) NOT NULL,
  `bot_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`product_id`, `bot_id`),
  KEY `idx_product_bot_bot` (`bot_id`),
  CONSTRAINT `fk_product_bot_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_bot_bot` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `product_tool` (
  `product_id` CHAR(36) NOT NULL,
  `tool_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`product_id`, `tool_id`),
  KEY `idx_product_tool_tool` (`tool_id`),
  CONSTRAINT `fk_product_tool_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_tool_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bot_tool` (
  `bot_id` CHAR(36) NOT NULL,
  `tool_id` CHAR(36) NOT NULL,
  PRIMARY KEY (`bot_id`, `tool_id`),
  KEY `idx_bot_tool_tool` (`tool_id`),
  CONSTRAINT `fk_bot_tool_bot` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bot_tool_tool` FOREIGN KEY (`tool_id`) REFERENCES `tool` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- FRONTPAGE MODULES (one-screen blocks, sortable)
CREATE TABLE `frontpage_module` (
  `id` CHAR(36) NOT NULL,
  `key` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `content` JSON NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_module_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- LEADS
CREATE TABLE `lead` (
  `id` CHAR(36) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(64) DEFAULT NULL,
  `interest` VARCHAR(255) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `source` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lead_tag` (
  `lead_id` CHAR(36) NOT NULL,
  `tag` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`lead_id`, `tag`),
  CONSTRAINT `fk_lead_tag_lead` FOREIGN KEY (`lead_id`) REFERENCES `lead` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- AI CHAT
CREATE TABLE `chat_session` (
  `id` CHAR(36) NOT NULL,
  `lead_id` CHAR(36) DEFAULT NULL,
  `bot_id` CHAR(36) DEFAULT NULL,
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metadata` JSON DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chat_lead` (`lead_id`),
  KEY `idx_chat_bot` (`bot_id`),
  CONSTRAINT `fk_chat_lead` FOREIGN KEY (`lead_id`) REFERENCES `lead` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_chat_bot` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `chat_message` (
  `id` CHAR(36) NOT NULL,
  `session_id` CHAR(36) NOT NULL,
  `role` VARCHAR(16) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tokens` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chat_session` (`session_id`),
  CONSTRAINT `fk_chat_message_session` FOREIGN KEY (`session_id`) REFERENCES `chat_session` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
