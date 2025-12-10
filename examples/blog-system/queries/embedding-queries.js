// =====================================================
// Запросы MongoDB для способа Embedding (встраивание)
// Использование: mongosh < embedding-queries.js
// Или интерактивно: mongosh
// =====================================================

// Выбираем базу данных
use("blog_embedding");

// Очистка существующих данных
db.users.drop();

// Вставка данных (структура Embedding)
print("=== Вставка данных (Embedding) ===");

db.users.insertMany([
  {
    _id: 1,
    username: "alice",
    email: "alice@example.com",
    created_at: new Date("2024-01-15T10:00:00Z"),
    posts: [
      {
        _id: 101,
        title: "Первый пост о MongoDB",
        content: "MongoDB - документоориентированная СУБД...",
        created_at: new Date("2024-01-20T14:30:00Z"),
        tags: ["mongodb", "nosql", "database"],
        comments: [
          {
            _id: 1001,
            author: { _id: 2, username: "bob" },
            text: "Отличная статья!",
            created_at: new Date("2024-01-20T15:00:00Z")
          },
          {
            _id: 1002,
            author: { _id: 3, username: "charlie" },
            text: "Очень полезно, спасибо!",
            created_at: new Date("2024-01-20T16:00:00Z")
          }
        ]
      },
      {
        _id: 102,
        title: "Второй пост о схемах",
        content: "Проектирование схем данных...",
        created_at: new Date("2024-01-25T09:00:00Z"),
        tags: ["schema", "design"],
        comments: []
      }
    ]
  },
  {
    _id: 2,
    username: "bob",
    email: "bob@example.com",
    created_at: new Date("2024-01-16T11:00:00Z"),
    posts: []
  },
  {
    _id: 3,
    username: "charlie",
    email: "charlie@example.com",
    created_at: new Date("2024-01-17T12:00:00Z"),
    posts: []
  }
]);

print("Данные вставлены успешно!\n");

// =====================================================
// ЗАПРОСЫ
// =====================================================

// 1. Получить пользователя со всеми постами и комментариями (ОДИН ЗАПРОС!)
print("=== Запрос 1: Получить пользователя alice со всеми данными ===");
var result1 = db.users.findOne({ username: "alice" });
printjson(result1);

// 2. Получить все посты пользователя
print("\n=== Запрос 2: Получить только посты пользователя alice ===");
var result2 = db.users.findOne(
  { username: "alice" },
  { posts: 1, _id: 0 }
);
printjson(result2);

// 3. Найти посты по тегу
print("\n=== Запрос 3: Найти пользователей с постами по тегу 'mongodb' ===");
var result3 = db.users.find(
  { "posts.tags": "mongodb" },
  { username: 1, "posts.$": 1 }
).toArray();
printjson(result3);

// 4. Подсчитать комментарии с помощью aggregation
print("\n=== Запрос 4: Подсчитать все комментарии для каждого пользователя ===");
var result4 = db.users.aggregate([
  { $unwind: { path: "$posts", preserveNullAndEmptyArrays: true } },
  { $project: {
      username: 1,
      comments_count: { $size: { $ifNull: ["$posts.comments", []] } }
    }
  },
  { $group: {
      _id: "$username",
      total_comments: { $sum: "$comments_count" }
    }
  }
]).toArray();
printjson(result4);

// 5. Добавить новый комментарий (UPDATE - сложная операция!)
print("\n=== Запрос 5: Добавить новый комментарий к посту 101 ===");
db.users.updateOne(
  { _id: 1, "posts._id": 101 },
  { 
    $push: {
      "posts.$.comments": {
        _id: 1003,
        author: { _id: 2, username: "bob" },
        text: "Новый комментарий!",
        created_at: new Date()
      }
    }
  }
);
print("Комментарий добавлен!");

// Проверяем результат
var result5 = db.users.findOne(
  { _id: 1 },
  { "posts.comments": 1 }
);
print("Комментарии после добавления:");
printjson(result5.posts[0].comments);

print("\n=== Все запросы выполнены ===");
