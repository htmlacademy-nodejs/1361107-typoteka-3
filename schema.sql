DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS articles_categories CASCADE;
DROP TABLE IF EXISTS comments_articles CASCADE;
DROP TABLE IF EXISTS comments_users CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL,
  email VARCHAR (50) NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  avatar VARCHAR
);

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

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR NOT NULL,
  user_id INTEGER,
  article_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles (id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE articles_categories (
  article_id INTEGER,
  category_id INTEGER,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX articles_categories_article_id_idx ON articles_categories (article_id);