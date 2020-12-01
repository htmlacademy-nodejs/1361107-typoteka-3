-- Cписок всех категорий
SELECT * from categories

-- Cписок категорий для которых создано минимум одно объявление
SELECT 
	articles_categories.category_id,
	categories.name
FROM articles_categories
INNER JOIN categories 
	ON articles_categories.category_id = categories.id
GROUP BY 
	articles_categories.category_id,
	categories.name

-- Cписок категорий с количеством объявлений
SELECT 
	articles_categories.category_id,
	categories.name,
	count(articles_categories.category_id)
FROM articles_categories
INNER JOIN categories 
	ON articles_categories.category_id = categories.id
GROUP BY 
	articles_categories.category_id,
	categories.name

-- Cписок объявлений 
SELECT 
	articles.id,
	articles.title,
  articles.announce,
	articles.picture,
	articles.fulltext,
	articles.created_date,
	users.firstname,
	users.lastname,
	users.email,
	(
		SELECT
			count(comments.id)
		FROM comments
		WHERE comments.article_id = articles.id
	) as "comment_amount",
	(
		SELECT
			string_agg(categories.name, ', ')
		FROM articles_categories
		INNER JOIN categories
			ON articles_categories.category_id = categories.id
		WHERE articles_categories.article_id = articles.id
	) as "category"
FROM articles
INNER JOIN users
	ON articles.owner = users.id
ORDER BY articles.created_date DESC

-- Полная информация определённого объявления
SELECT 
	articles.id,
	articles.title,
  articles.announce,
	articles.picture,
	articles.fulltext,
	articles.created_date,
	users.firstname,
	users.lastname,
	users.email,
	(
		SELECT
			count(comments.id)
		FROM comments
		WHERE comments.article_id = articles.id
	) as "comment_amount",
	(
		SELECT
			string_agg(categories.name, ', ')
		FROM articles_categories
		INNER JOIN categories
			ON articles_categories.category_id = categories.id
		WHERE articles_categories.article_id = articles.id
	) as "category"
FROM articles
INNER JOIN users
	ON articles.owner = users.id
WHERE articles.id = 1

-- Список из 5 свежих комментариев
SELECT
	comments.id as "comment_id",
	comments.article_id,
	users.firstname,
	users.lastname,
	comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
ORDER BY comments.id DESC
LIMIT 5

-- Список комментариев для определённого объявления
SELECT
	comments.id as "comment_id",
	comments.article_id,
	users.firstname,
	users.lastname,
	comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
WHERE comments.article_id = 3
ORDER BY comments.id DESC

-- Обновление заголовка определённого объявления
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1