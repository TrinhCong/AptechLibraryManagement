--<ScriptOptions statementTerminator=";"/>

ALTER TABLE `database`.`lost_books` DROP PRIMARY KEY;

ALTER TABLE `database`.`damaged_books` DROP PRIMARY KEY;

ALTER TABLE `database`.`books` DROP PRIMARY KEY;

ALTER TABLE `database`.`users` DROP PRIMARY KEY;

ALTER TABLE `database`.`borrowing_books` DROP PRIMARY KEY;

ALTER TABLE `database`.`subjects` DROP PRIMARY KEY;

ALTER TABLE `database`.`authors` DROP PRIMARY KEY;

ALTER TABLE `database`.`books` DROP INDEX `database`.`books_FK`;

ALTER TABLE `database`.`lost_books` DROP INDEX `database`.`lost_books_FK`;

ALTER TABLE `database`.`books` DROP INDEX `database`.`books_FK_1`;

ALTER TABLE `database`.`borrowing_books` DROP INDEX `database`.`borrowing_books_FK_1`;

ALTER TABLE `database`.`damaged_books` DROP INDEX `database`.`damaged_books_FK`;

ALTER TABLE `database`.`borrowing_books` DROP INDEX `database`.`borrowing_books_FK`;

ALTER TABLE `database`.`users` DROP INDEX `database`.`USER`;

DROP TABLE `database`.`damaged_books`;

DROP TABLE `database`.`books`;

DROP TABLE `database`.`users`;

DROP TABLE `database`.`subjects`;

DROP TABLE `database`.`borrowing_books`;

DROP TABLE `database`.`lost_books`;

DROP TABLE `database`.`authors`;

CREATE TABLE `database`.`damaged_books` (
	`id` INT NOT NULL,
	`book_id` INT NOT NULL,
	`updated_at` DATETIME NOT NULL,
	`quantity` INT,
	`reason` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`books` (
	`id` INT NOT NULL,
	`code` VARCHAR(30) NOT NULL,
	`title` VARCHAR(100) NOT NULL,
	`description` TEXT,
	`rent_price` FLOAT NOT NULL,
	`quantity` INT,
	`subject_id` INT NOT NULL,
	`author_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`users` (
	`id` INT NOT NULL,
	`user_name` VARCHAR(100) NOT NULL,
	`password` VARCHAR(100) NOT NULL,
	`display_name` VARCHAR(100) NOT NULL,
	`birthdate` DATE,
	`gender` TINYINT,
	`role` VARCHAR(20) NOT NULL,
	`address` VARCHAR(100),
	`birthDateStr` VARCHAR(255),
	`USER` CHAR(32),
	`CURRENT_CONNECTIONS` BIGINT NOT NULL,
	`TOTAL_CONNECTIONS` BIGINT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`subjects` (
	`id` INT NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`description` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`borrowing_books` (
	`id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`book_id` INT NOT NULL,
	`borrowed_at` DATETIME NOT NULL,
	`returned_at` DATETIME,
	`expirated_at` DATETIME,
	`rental` FLOAT,
	`quantity` INT,
	`note` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`lost_books` (
	`id` INT NOT NULL,
	`book_id` INT NOT NULL,
	`updated_at` DATETIME NOT NULL,
	`quantity` INT,
	`reason` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `database`.`authors` (
	`id` INT NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`description` TEXT,
	PRIMARY KEY (`id`)
);

CREATE INDEX `books_FK` ON `database`.`books` (`author_id` ASC);

CREATE INDEX `lost_books_FK` ON `database`.`lost_books` (`book_id` ASC);

CREATE INDEX `books_FK_1` ON `database`.`books` (`subject_id` ASC);

CREATE INDEX `borrowing_books_FK_1` ON `database`.`borrowing_books` (`book_id` ASC);

CREATE INDEX `damaged_books_FK` ON `database`.`damaged_books` (`book_id` ASC);

CREATE INDEX `borrowing_books_FK` ON `database`.`borrowing_books` (`user_id` ASC);

CREATE UNIQUE INDEX `USER` ON `database`.`users` (null);

