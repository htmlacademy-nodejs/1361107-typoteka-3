DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS comments_articles;
DROP TABLE IF EXISTS comments_users;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

CREATE UNIQUE INDEX categories_name_idx ON categories (name);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL,
  email VARCHAR (50) NOT NULL,
  password VARCHAR NOT NULL,
  avatar VARCHAR
);

CREATE UNIQUE INDEX users_email_idx ON users (email);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR (250) NOT NULL,
  announce VARCHAR (250) NOT NULL,
  picture VARCHAR,
  fulltext VARCHAR (1000),
  owner INTEGER NOT NULL,
  created_date DATE NOT NULL,
  FOREIGN KEY (owner) REFERENCES users (id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE INDEX articles_title_idx ON articles (title);
CREATE INDEX articles_id_idx ON articles (id);

CREATE TABLE articles_categories (
  article_id INTEGER,
  category_id INTEGER,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX articles_categories_article_id_idx ON articles_categories (article_id);

CREATE TABLE comments_articles (
  comment_id INTEGER,
  article_id INTEGER,
  CONSTRAINT comments_articles_pk PRIMARY KEY (comment_id, article_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX comments_articles_comment_id_idx ON comments_articles (comment_id);
CREATE INDEX comments_articles_article_id_idx ON comments_articles (article_id);

CREATE TABLE comments_users (
  comment_id INTEGER,
  user_id INTEGER,
  CONSTRAINT comments_users_pk PRIMARY KEY (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX comments_users_comment_id_idx ON comments_users (comment_id);