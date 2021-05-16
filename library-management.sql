-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: library_management
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'tesst','fewafwa');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `rent_price` float NOT NULL,
  `quantity` int DEFAULT NULL,
  `subject_id` int NOT NULL,
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `books_FK` (`author_id`),
  KEY `books_FK_1` (`subject_id`),
  CONSTRAINT `books_FK` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`),
  CONSTRAINT `books_FK_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'fewafewa','feawfewa','faewhoifea',214021,209,1,1);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrowing_books`
--

DROP TABLE IF EXISTS `borrowing_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrowing_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `borrowed_at` datetime NOT NULL,
  `returned_at` datetime DEFAULT NULL,
  `expirated_at` datetime DEFAULT NULL,
  `rental` float DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `borrowing_books_FK` (`user_id`),
  KEY `borrowing_books_FK_1` (`book_id`),
  CONSTRAINT `borrowing_books_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `borrowing_books_FK_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrowing_books`
--

LOCK TABLES `borrowing_books` WRITE;
/*!40000 ALTER TABLE `borrowing_books` DISABLE KEYS */;
INSERT INTO `borrowing_books` VALUES (1,5,1,'2021-05-16 21:03:32',NULL,NULL,2154,1,'fewalgfua');
/*!40000 ALTER TABLE `borrowing_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `damaged_books`
--

DROP TABLE IF EXISTS `damaged_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `damaged_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  `quantity` int DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`id`),
  KEY `damaged_books_FK` (`book_id`),
  CONSTRAINT `damaged_books_FK` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `damaged_books`
--

LOCK TABLES `damaged_books` WRITE;
/*!40000 ALTER TABLE `damaged_books` DISABLE KEYS */;
INSERT INTO `damaged_books` VALUES (1,1,'2021-05-16 21:38:50',1,'febwaif');
/*!40000 ALTER TABLE `damaged_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_books`
--

DROP TABLE IF EXISTS `lost_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lost_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  `quantity` int DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`id`),
  KEY `lost_books_FK` (`book_id`),
  CONSTRAINT `lost_books_FK` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_books`
--

LOCK TABLES `lost_books` WRITE;
/*!40000 ALTER TABLE `lost_books` DISABLE KEYS */;
INSERT INTO `lost_books` VALUES (1,1,'2021-05-16 21:41:24',1,'ewafa');
/*!40000 ALTER TABLE `lost_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'ewfae','fewaf');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `display_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthDateStr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'admin','$2a$12$N9aoVaCtHTslG6zvB5TgGerK2frr3hs5qmEP3PttnoSWThO36CmQK','Administrator','1998-01-02',0,'admin','19 Nguyen Trai',NULL),(3,'cong.trinh','$2a$12$P5ybQXyaG/ljnecdGJDdIuk7TfYCI64.hFjnt8f1xtiKDhCXi9Bfy','Trịnh Văn Công','1992-05-20',1,'admin','19 Nguyễn Trãi',NULL),(5,'khai.tran','$2a$12$Wb2odkKmPnjqbMcRsO6t5el.upzRXzb85EcuaALkxl1GUoQ8QsmKC','Trần Công Khải','2021-05-14',1,'user','19 Nguyễn Trãi',NULL),(6,'quan.tran','$2a$12$TpB4JAxXSt4rxspTumfv0eaEMM/nXIvcTvYKR7Yj9tCc7oe9RvKKu','Trần Quân','1995-06-16',1,'user','19 Nguyễn Trãi',NULL),(7,'dat.tran','$2a$12$/LiNmBwTEUC.CCp/VWo6Pe2A0.o5afNt5TgcIErjkoHufN.HmHpya','Trần Thanh Đạt','2000-07-15',1,'admin','19 Nguyễn Trãi',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'library_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-16 21:46:46
