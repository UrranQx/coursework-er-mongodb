// =====================================================
// Запросы MongoDB для способа Referencing (ссылки)
// Использование: mongosh < referencing-queries.js
// Или интерактивно: mongosh
// =====================================================

// Выбираем базу данных
use("blog_referencing");

// Очистка существующих данных
db.users.drop();
db.posts.drop();
db.comments.drop();
db.tags.drop();

// Вставка данных (структура Referencing)
print("=== Вставка данных (Referencing) ===");

// Коллекция users
db.users.insertMany([
  {
    _id: 1,
    username: "alice",
    email: "alice@example.com",
    created_at: new Date("2024-01-15T10:00:00Z")
  },
  {
    _id: 2,
    username: "bob",
    email: "bob@example.com",
    created_at: new Date("2024-01-16T11:00:00Z")
  },
  {
    _id: 3,
    username: "charlie",
    email: "charlie@example.com",
    created_at: new Date("2024-01-17T12:00:00Z")
  }
]);

// Коллекция tags
db.tags.insertMany([
  { _id: 1, name: "mongodb" },
  { _id: 2, name: "nosql" },
  { _id: 3, name: "database" },
  { _id: 4, name: "schema" },
  { _id: 5, name: "design" }
]);

// Коллекция posts
db.posts.insertMany([
  {
    _id: 101,
    author_id: 1,
    title: "Первый пост о MongoDB",
    content: "MongoDB - документоориентированная СУБД...",
    created_at: new Date("2024-01-20T14:30:00Z"),
    tag_ids: [1, 2, 3]
  },
  {
    _id: 102,
    author_id: 1,
    title: "Второй пост о схемах",
    content: "Проектирование схем данных...",
    created_at: new Date("2024-01-25T09:00:00Z"),
    tag_ids: [4, 5]
  }
]);

// Коллекция comments
db.comments.insertMany([
  {
    _id: 1001,
    post_id: 101,
    author_id: 2,
    text: "Отличная статья!",
    created_at: new Date("2024-01-20T15:00:00Z")
  },
  {
    _id: 1002,
    post_id: 101,
    author_id: 3,
    text: "Очень полезно, спасибо!",
    created_at: new Date("2024-01-20T16:00:00Z")
  }
]);

print("Данные вставлены успешно!\n");

// =====================================================
// ЗАПРОСЫ
// =====================================================

// 1. Получить пост с информацией об авторе ($lookup)
print("=== Запрос 1: Получить пост с автором ===");
var result1 = db.posts.aggregate([
  { $match: { _id: 101 } },
  { $lookup: {
      from: "users",
      localField: "author_id",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  { $project: {
      title: 1,
      content: 1,
      "author.username": 1,
      "author.email": 1
    }
  }
]).toArray();
printjson(result1);

// 2. Получить пост со всеми комментариями и авторами комментариев
print("\n=== Запрос 2: Пост с комментариями и авторами (множественный $lookup) ===");
var result2 = db.posts.aggregate([
  { $match: { _id: 101 } },
  // Join с автором поста
  { $lookup: {
      from: "users",
      localField: "author_id",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  // Join с комментариями
  { $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "post_id",
      as: "comments"
    }
  },
  // Join авторов комментариев
  { $lookup: {
      from: "users",
      localField: "comments.author_id",
      foreignField: "_id",
      as: "comment_authors"
    }
  }
]).toArray();
printjson(result2);

// 3. Получить все посты пользователя
print("\n=== Запрос 3: Все посты пользователя alice ===");
var result3 = db.posts.aggregate([
  { $lookup: {
      from: "users",
      localField: "author_id",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  { $match: { "author.username": "alice" } },
  { $project: {
      title: 1,
      created_at: 1,
      "author.username": 1
    }
  }
]).toArray();
printjson(result3);

// 4. Найти посты по тегу
print("\n=== Запрос 4: Посты с тегом 'mongodb' ===");
var result4 = db.posts.aggregate([
  // Найти ID тега
  { $lookup: {
      from: "tags",
      let: { tagIds: "$tag_ids" },
      pipeline: [
        { $match: { 
            $expr: { $in: ["$_id", "$$tagIds"] },
            name: "mongodb"
          }
        }
      ],
      as: "matched_tags"
    }
  },
  { $match: { "matched_tags.0": { $exists: true } } },
  { $project: {
      title: 1,
      tag_ids: 1
    }
  }
]).toArray();
printjson(result4);

// 5. Добавить новый комментарий (ПРОСТАЯ операция!)
print("\n=== Запрос 5: Добавить новый комментарий ===");
db.comments.insertOne({
  _id: 1003,
  post_id: 101,
  author_id: 2,
  text: "Новый комментарий!",
  created_at: new Date()
});
print("Комментарий добавлен!");

// Проверяем
var result5 = db.comments.find({ post_id: 101 }).toArray();
print("Все комментарии к посту 101:");
printjson(result5);

// 6. Подсчёт комментариев для поста
print("\n=== Запрос 6: Подсчёт комментариев для каждого поста ===");
var result6 = db.comments.aggregate([
  { $group: {
      _id: "$post_id",
      count: { $sum: 1 }
    }
  }
]).toArray();
printjson(result6);

print("\n=== Все запросы выполнены ===");
