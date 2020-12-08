--<ScriptOptions statementTerminator=";"/>

CREATE TABLE subjects (
	id INT NOT NULL,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE books (
	id INT NOT NULL,
	code VARCHAR(30) NOT NULL,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	rent_price FLOAT NOT NULL,
	quantity INT,
	subject_id INT NOT NULL,
	author_id INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE borrowing_books (
	id INT NOT NULL,
	user_id INT NOT NULL,
	book_id INT NOT NULL,
	borrowed_at DATETIME NOT NULL,
	returned_at DATETIME,
	rental FLOAT,
	returned BIT,
	quantity INT,
	PRIMARY KEY (id)
);

CREATE TABLE damaged_books (
	id INT NOT NULL,
	book_id INT NOT NULL,
	updated_at DATETIME NOT NULL,
	quantity INT,
	reason TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE users (
	id INT NOT NULL,
	user_name VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	display_name VARCHAR(100) NOT NULL,
	age INT,
	birthdate DATE,
	gender TINYINT,
	address VARCHAR(100),
	USER CHAR(32),
	CURRENT_CONNECTIONS BIGINT NOT NULL,
	TOTAL_CONNECTIONS BIGINT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE authors (
	id INT NOT NULL,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE lost_books (
	id INT NOT NULL,
	book_id INT NOT NULL,
	updated_at DATETIME NOT NULL,
	quantity INT,
	reason TEXT,
	PRIMARY KEY (id)
);

CREATE INDEX borrowing_books_FK_1 ON borrowing_books (book_id ASC);

CREATE UNIQUE INDEX USER ON users (null);

CREATE INDEX lost_books_FK ON lost_books (book_id ASC);

CREATE INDEX borrowing_books_FK ON borrowing_books (user_id ASC);

CREATE INDEX damaged_books_FK ON damaged_books (book_id ASC);

CREATE INDEX books_FK ON books (author_id ASC);

CREATE INDEX books_FK_1 ON books (subject_id ASC);


