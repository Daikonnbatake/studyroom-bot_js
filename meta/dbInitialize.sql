CREATE DATABASE IF NOT EXISTS `discord_srb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `discord_srb`;

CREATE TABLE `users` (
  `id` int NOT NULL,
  `discord_user_id` bigint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UN` (`discord_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `channels` (
  `id` int NOT NULL,
  `discord_channel_id` bigint unsigned NOT NULL DEFAULT '0',
  `rated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `channels_UN` (`discord_channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guilds` (
  `id` int NOT NULL,
  `discord_guild_id` bigint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `guilds_UN` (`discord_guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mid_guilds_users` (
  `id` int NOT NULL,
  `guild_id` int NOT NULL,
  `user_id` int NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `mid_guilds_users_FK` (`user_id`),
  KEY `mid_guilds_users_FK_1` (`guild_id`),
  CONSTRAINT `mid_guilds_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `mid_guilds_users_FK_1` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `voice_activities` (
  `id` int NOT NULL,
  `guild_id` int NOT NULL DEFAULT '0',
  `channel_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0なら退室、1なら入室',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voice_activities_UN` (`id`),
  KEY `voice_activities_FK` (`guild_id`),
  KEY `voice_activities_FK_2` (`user_id`),
  KEY `voice_activities_FK_1` (`channel_id`),
  CONSTRAINT `voice_activities_FK` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`),
  CONSTRAINT `voice_activities_FK_1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `voice_activities_FK_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
