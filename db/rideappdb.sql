-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: ride_app
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `driver_profiles`
--

DROP TABLE IF EXISTS `driver_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `active` bit(1) NOT NULL DEFAULT b'1',
  `average_rating` double NOT NULL DEFAULT '0',
  `total_ratings` int NOT NULL DEFAULT '0',
  `vehicle_class` varchar(20) NOT NULL,
  `car_brand` varchar(50) NOT NULL,
  `car_model` varchar(50) NOT NULL,
  `car_color` varchar(30) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `seats` int NOT NULL DEFAULT '4',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `uq_driver_profiles_plate_number` (`plate_number`),
  CONSTRAINT `fk_driver_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_profiles`
--

LOCK TABLES `driver_profiles` WRITE;
/*!40000 ALTER TABLE `driver_profiles` DISABLE KEYS */;
INSERT INTO `driver_profiles` VALUES (2,7,'LIC231',2,_binary '',0,0,'ECONOMIC','Opel','Astra J Comfort','Black','BG-123-23',4),(3,8,'LIC2311',10,_binary '',0,0,'BUSINESS','BMW','320D','Gray','BG-320-KK',4),(4,9,'LIC3321',7,_binary '',3,1,'COMFORT','Mercedes','Vito','Red','NS-223-AE',7);
/*!40000 ALTER TABLE `driver_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ride_ratings`
--

DROP TABLE IF EXISTS `ride_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ride_ratings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ride_id` bigint NOT NULL,
  `from_user_id` bigint NOT NULL,
  `to_user_id` bigint NOT NULL,
  `rating_type` varchar(30) NOT NULL,
  `score` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ride_ratings_unique` (`ride_id`,`from_user_id`,`to_user_id`,`rating_type`),
  KEY `idx_ride_ratings_ride_id` (`ride_id`),
  KEY `idx_ride_ratings_from_user_id` (`from_user_id`),
  KEY `idx_ride_ratings_to_user_id` (`to_user_id`),
  KEY `idx_ride_ratings_rating_type` (`rating_type`),
  CONSTRAINT `fk_ride_ratings_from_user` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ride_ratings_ride` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`),
  CONSTRAINT `fk_ride_ratings_to_user` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ride_ratings`
--

LOCK TABLES `ride_ratings` WRITE;
/*!40000 ALTER TABLE `ride_ratings` DISABLE KEYS */;
INSERT INTO `ride_ratings` VALUES (1,3,3,5,'DRIVER_TO_PASSENGER',4,'2026-04-23 07:18:28'),(2,2,3,5,'DRIVER_TO_PASSENGER',4,'2026-04-23 07:18:41'),(3,1,3,5,'DRIVER_TO_PASSENGER',5,'2026-04-23 07:18:45'),(4,3,5,3,'PASSENGER_TO_DRIVER',3,'2026-04-23 07:19:36'),(5,2,5,3,'PASSENGER_TO_DRIVER',5,'2026-04-23 07:19:40'),(6,1,5,3,'PASSENGER_TO_DRIVER',2,'2026-04-23 07:19:44'),(7,5,7,5,'DRIVER_TO_PASSENGER',5,'2026-04-24 09:55:13'),(8,4,9,5,'DRIVER_TO_PASSENGER',5,'2026-04-24 10:58:54'),(9,6,8,5,'DRIVER_TO_PASSENGER',3,'2026-04-24 14:35:05'),(10,7,7,10,'DRIVER_TO_PASSENGER',5,'2026-04-24 14:37:26'),(11,7,10,7,'PASSENGER_TO_DRIVER',5,'2026-04-24 14:38:38'),(12,10,8,5,'DRIVER_TO_PASSENGER',5,'2026-04-25 08:09:37'),(13,10,5,8,'PASSENGER_TO_DRIVER',5,'2026-04-25 08:10:14'),(14,11,8,5,'DRIVER_TO_PASSENGER',4,'2026-04-27 05:53:09'),(15,11,5,8,'PASSENGER_TO_DRIVER',5,'2026-04-27 05:53:56'),(16,12,7,5,'DRIVER_TO_PASSENGER',5,'2026-04-27 06:00:42'),(17,12,5,7,'PASSENGER_TO_DRIVER',5,'2026-05-04 13:28:17'),(18,13,8,5,'DRIVER_TO_PASSENGER',5,'2026-05-04 13:30:47'),(19,14,9,5,'DRIVER_TO_PASSENGER',4,'2026-05-05 06:10:27'),(20,14,5,9,'PASSENGER_TO_DRIVER',3,'2026-05-05 06:10:56'),(21,15,9,5,'DRIVER_TO_PASSENGER',5,'2026-05-07 13:23:20');
/*!40000 ALTER TABLE `ride_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rides`
--

DROP TABLE IF EXISTS `rides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rides` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pickup_lat` double NOT NULL,
  `pickup_lng` double NOT NULL,
  `dropoff_lat` double NOT NULL,
  `dropoff_lng` double NOT NULL,
  `vehicle_class` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `distance_meters` bigint NOT NULL,
  `duration_seconds` bigint NOT NULL,
  `currency` varchar(10) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `distance_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `scheduled_for` datetime DEFAULT NULL,
  `passenger_id` bigint NOT NULL,
  `driver_id` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pickup_address` varchar(500) DEFAULT NULL,
  `dropoff_address` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_rides_passenger_id` (`passenger_id`),
  KEY `idx_rides_driver_id` (`driver_id`),
  KEY `idx_rides_status` (`status`),
  KEY `idx_rides_created_at` (`created_at`),
  CONSTRAINT `fk_rides_driver` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rides_passenger` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rides`
--

LOCK TABLES `rides` WRITE;
/*!40000 ALTER TABLE `rides` DISABLE KEYS */;
INSERT INTO `rides` VALUES (1,44.8125449,20.46123,44.0127932,20.9114225,'ECONOMIC','COMPLETED',139162,5834,'RSD',150.00,9741.20,9891.20,'2026-04-11 15:49:00',5,3,'2026-04-10 10:49:46','2026-04-10 11:18:01',NULL,NULL),(2,44.1543353,21.0804687,44.0127932,20.9114225,'BUSINESS','COMPLETED',24468,1480,'RSD',250.00,2691.70,2941.70,'2026-04-10 15:32:00',5,3,'2026-04-10 11:33:25','2026-04-10 11:34:14',NULL,NULL),(3,44.0127932,20.9114225,44.1785009,21.0911317,'BUSINESS','COMPLETED',27536,1737,'RSD',250.00,3029.40,3279.40,'2026-04-16 09:06:00',5,3,'2026-04-15 06:06:24','2026-04-15 06:07:00',NULL,NULL),(4,44.8125449,20.46123,44.0127932,20.9114225,'COMFORT','COMPLETED',139162,5791,'RSD',300.00,18090.80,18390.80,'2026-04-25 20:37:00',5,9,'2026-04-24 05:38:48','2026-04-24 10:38:08',NULL,NULL),(5,44.1785009,21.0911317,44.1543353,21.0804687,'ECONOMIC','COMPLETED',3012,260,'RSD',150.00,210.70,360.70,'2026-04-29 17:41:00',5,7,'2026-04-24 09:37:15','2026-04-24 09:55:07',NULL,NULL),(6,44.1785009,21.0911317,44.3358764,21.0770814,'BUSINESS','COMPLETED',21429,983,'RSD',250.00,2357.30,2607.30,'2026-05-28 20:44:00',5,8,'2026-04-24 09:37:47','2026-04-24 14:33:50',NULL,NULL),(7,45.2473923,19.782131,43.5786526,21.3356957,'ECONOMIC','COMPLETED',298170,10996,'RSD',150.00,20871.90,21021.90,'2026-04-25 08:00:00',10,7,'2026-04-24 14:22:01','2026-04-24 14:37:20',NULL,NULL),(8,43.5786526,21.3356957,44.8125449,20.46123,'COMFORT','CANCELLED',198371,7374,'RSD',300.00,25788.10,26088.10,'2026-12-11 23:00:00',10,11,'2026-04-24 14:24:21','2026-04-24 14:31:20',NULL,NULL),(9,44.1543353,21.0804687,44.1785009,21.0911317,'ECONOMIC','REQUESTED',3012,260,'RSD',150.00,210.70,360.70,'2026-04-20 10:00:00',5,NULL,'2026-04-25 07:51:01','2026-04-25 07:51:01',NULL,NULL),(10,44.0127932,20.9114225,42.55209050000001,21.8988536,'BUSINESS','COMPLETED',254773,9352,'RSD',250.00,28024.70,28274.70,NULL,5,8,'2026-04-25 07:52:56','2026-04-25 08:09:31',NULL,NULL),(11,44.0480462,20.916618,44.00693099999999,20.9054704,'BUSINESS','COMPLETED',5281,717,'RSD',250.00,580.80,830.80,'2026-04-27 12:17:00',5,8,'2026-04-27 05:47:59','2026-04-27 05:52:45',NULL,NULL),(12,44.0144331,20.9221929,44.8083301,20.4635596,'ECONOMIC','COMPLETED',138379,5356,'RSD',150.00,9686.60,9836.60,'2026-04-27 10:00:00',5,7,'2026-04-27 05:58:38','2026-04-27 06:00:28',NULL,NULL),(13,44.1785009,21.0911317,44.0127932,20.9114225,'BUSINESS','COMPLETED',27482,1743,'RSD',250.00,3022.80,3272.80,'2026-05-05 10:15:00',5,8,'2026-05-04 13:26:25','2026-05-04 13:30:33',NULL,NULL),(14,44.1785009,21.0911317,44.0127932,20.9114225,'COMFORT','COMPLETED',27482,1743,'RSD',300.00,3572.40,3872.40,'2026-05-12 10:00:00',5,9,'2026-05-05 06:09:38','2026-05-05 06:10:22','Lapovo, Serbia','Kragujevac, Serbia'),(15,44.0127932,20.9114225,44.1785009,21.0911317,'COMFORT','COMPLETED',27536,1736,'RSD',300.00,3580.20,3880.20,'2026-05-07 16:00:00',5,9,'2026-05-07 13:22:05','2026-05-07 13:23:04','Kragujevac, Serbia','Lapovo, Serbia');
/*!40000 ALTER TABLE `rides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(80) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','DRIVER','USER') NOT NULL DEFAULT 'USER',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  UNIQUE KEY `uk_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Marko','Stojanovic','stojanovicmarko688@gmail.com','marko245','$2a$10$U6KLuI..mBhgjXMmP4VFfeJF6P1gfRsQlps5sDOyGD6ouGoM2jsDK','DRIVER',1,'2026-03-15 17:02:10'),(4,'Teodora','Milenkovic','tea@example.com','teatea','$2a$10$tsJRrGeDIvKFrsIhGeXP1ON/0HorRqkXBpUm47JriNcj48jhQF9h6','USER',1,'2026-03-15 17:04:35'),(5,'Testing','Passenger','passenger@test.com','Test Passenger','$2a$10$KKUM7EfbVt8.Rr5fr1hU..kvHizZlXwodNh2Nkns6sRdtLa2wCotC','USER',1,'2026-04-10 10:48:13'),(7,'Economic','Driver','economic.driver@gmail.com','EconomicDriver','$2a$10$YkGQyBgQQ8NNm.Iu9mep/OC0V/PTHHmdr4167dvf/xdYq6wXVHzXe','DRIVER',1,'2026-04-24 05:31:22'),(8,'Business','Driver','business.driver@gmail.com','Business','$2a$10$1aWodVb6lm6Jkz465WMVjuu/OvE88RGpClZ.mxGoPTSBbccyEX5Ky','DRIVER',1,'2026-04-24 05:35:06'),(9,'Comfort','Driver','comfort.driver@gmail.com','ComfortDriver','$2a$10$tgudUqxwHMOK3HN34hVTHe0SYvE4SijRzPs5cia6w5B3lmzm3nhB6','DRIVER',1,'2026-04-24 05:36:58'),(10,'Teodora','Stojanovic','tekanamekana@gmail.com','tekanamekana','$2a$10$zNSe/vaKW8NXLqfntrcql.fDbxAj7jr5RVxmegb9o8/wauP5ba81S','USER',1,'2026-04-24 14:17:59'),(11,'tea','mile','m.stojanovic@solutions-dt.com','ffdffddf','$2a$10$Uk6vCKy2pX/O.hnbwwPpZe7lG/cYdzSFjy8FeJYWVh0McADOKEb.a','DRIVER',1,'2026-04-24 14:29:56'),(12,'Admin','Admin','admin@gmail.com','admin','$2a$10$OFMoWr9KGGQpe7qfSYaGKOaqiIIl9ju52d.al03OEVjTGRT/RekIe','ADMIN',1,'2026-04-25 07:55:07'),(13,'Test','Driver','driver@test.com','Drivrer','$2a$10$7JirRPQZzwiBzt711frhA.a/WH41ICe1.u8UqNm7MO6UulsVJjnA6','DRIVER',1,'2026-04-29 06:23:53'),(14,'Marko','Stojanovic','m.stojansssovic@sssss.com','Marko','$2a$10$ZQ/ypARnNlJUXvmHtYCko.JRdFPFSh4rAY6rRf.5ttBneY7qv1EOC','USER',0,'2026-04-29 06:38:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 10:52:21
