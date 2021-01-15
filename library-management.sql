

DROP TABLE IF EXISTS `authors`;

CREATE TABLE `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
);
LOCK TABLES `authors` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
);

LOCK TABLES `subjects` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `books`;
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
  CONSTRAINT `books_FK` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `books_FK_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
);
LOCK TABLES `books` WRITE;
UNLOCK TABLES;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `display_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `age` int DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;
LOCK TABLES `users` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `borrowing_books`;

CREATE TABLE `borrowing_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `borrowed_at` datetime NOT NULL,
  `returned_at` datetime DEFAULT NULL,
  `rental` float DEFAULT NULL,
  `returned` tinyint(1) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `borrowing_books_FK` (`user_id`),
  KEY `borrowing_books_FK_1` (`book_id`),
  CONSTRAINT `borrowing_books_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `borrowing_books_FK_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
);

LOCK TABLES `borrowing_books` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `damaged_books`;
CREATE TABLE `damaged_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  `quantity` int DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`id`),
  KEY `damaged_books_FK` (`book_id`),
  CONSTRAINT `damaged_books_FK` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
);



LOCK TABLES `damaged_books` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `lost_books`;
CREATE TABLE `lost_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  `quantity` int DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`id`),
  KEY `lost_books_FK` (`book_id`),
  CONSTRAINT `lost_books_FK` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
);

LOCK TABLES `lost_books` WRITE;
UNLOCK TABLES;
