// =====================================================
// Запросы MongoDB для Гибридного подхода (Hybrid)
// Использование: mongosh < hybrid-queries.js
// Или интерактивно: mongosh
// =====================================================

// Выбираем базу данных
use("blog_hybrid");

// Очистка существующих данных
db.users.drop();
db.posts.drop();
db.comments.drop();
db.tags.drop();

// Вставка данных (структура Hybrid)
print("=== Вставка данных (Hybrid) ===");

// Коллекция users (с денормализованной статистикой)
db.users.insertMany([
  {
    _id: 1,
    username: "alice",
    email: "alice@example.com",
    created_at: new Date("2024-01-15T10:00:00Z"),
    stats: {
      posts_count: 2,
      comments_count: 0
    }
  },
  {
    _id: 2,
    username: "bob",
    email: "bob@example.com",
    created_at: new Date("2024-01-16T11:00:00Z"),
    stats: {
      posts_count: 0,
      comments_count: 1
    }
  },
  {
    _id: 3,
    username: "charlie",
    email: "charlie@example.com",
    created_at: new Date("2024-01-17T12:00:00Z"),
    stats: {
      posts_count: 0,
      comments_count: 1
    }
  }
]);

// Коллекция posts (с встроенным автором и последними комментариями)
db.posts.insertMany([
  {
    _id: 101,
    author: {
      _id: 1,
      username: "alice"
    },
    title: "Первый пост о MongoDB",
    content: "MongoDB - документоориентированная СУБД...",
    created_at: new Date("2024-01-20T14:30:00Z"),
    tags: ["mongodb", "nosql", "database"],
    comments_count: 2,
    recent_comments: [
      {
        _id: 1002,
        author: {
          _id: 3,
          username: "charlie"
        },
        text: "Очень полезно, спасибо!",
        created_at: new Date("2024-01-20T16:00:00Z")
      }
    ]
  },
  {
    _id: 102,
    author: {
      _id: 1,
      username: "alice"
    },
    title: "Второй пост о схемах",
    content: "Проектирование схем данных...",
    created_at: new Date("2024-01-25T09:00:00Z"),
    tags: ["schema", "design"],
    comments_count: 0,
    recent_comments: []
  }
]);

// Коллекция comments (отдельная для всех комментариев)
db.comments.insertMany([
  {
    _id: 1001,
    post_id: 101,
    author: {
      _id: 2,
      username: "bob"
    },
    text: "Отличная статья!",
    created_at: new Date("2024-01-20T15:00:00Z")
  },
  {
    _id: 1002,
    post_id: 101,
    author: {
      _id: 3,
      username: "charlie"
    },
    text: "Очень полезно, спасибо!",
    created_at: new Date("2024-01-20T16:00:00Z")
  }
]);

// Коллекция tags (с денормализованным счётчиком)
db.tags.insertMany([
  { _id: 1, name: "mongodb", posts_count: 1 },
  { _id: 2, name: "nosql", posts_count: 1 },
  { _id: 3, name: "database", posts_count: 1 },
  { _id: 4, name: "schema", posts_count: 1 },
  { _id: 5, name: "design", posts_count: 1 }
]);

print("Данные вставлены успешно!\n");

// =====================================================
// ЗАПРОСЫ
// =====================================================

// 1. Получить пост с автором и preview комментариев (БЕЗ $lookup!)
print("=== Запрос 1: Пост с автором и preview комментариев (один запрос) ===");
var result1 = db.posts.findOne({ _id: 101 });
printjson(result1);

// 2. Получить все посты пользователя (БЕЗ $lookup!)
print("\n=== Запрос 2: Посты пользователя alice (без $lookup) ===");
var result2 = db.posts.find({ "author._id": 1 }).toArray();
printjson(result2);

// 3. Найти посты по тегу (БЕЗ $lookup!)
print("\n=== Запрос 3: Посты с тегом 'mongodb' (без $lookup) ===");
var result3 = db.posts.find({ tags: "mongodb" }).toArray();
printjson(result3);

// 4. Получить ВСЕ комментарии к посту (нужен запрос к comments)
print("\n=== Запрос 4: Все комментарии к посту 101 ===");
var result4 = db.comments.find({ post_id: 101 }).toArray();
printjson(result4);

// 5. Добавить новый комментарий (с обновлением денормализованных данных)
print("\n=== Запрос 5: Добавить комментарий (с синхронизацией) ===");

var newComment = {
  _id: 1003,
  post_id: 101,
  author: {
    _id: 2,
    username: "bob"
  },
  text: "Ещё один комментарий!",
  created_at: new Date()
};

// 5.1 Вставить комментарий
db.comments.insertOne(newComment);
print("Комментарий добавлен в коллекцию comments");

// 5.2 Обновить счётчик в посте
db.posts.updateOne(
  { _id: 101 },
  { $inc: { comments_count: 1 } }
);
print("Счётчик комментариев обновлён");

// 5.3 Обновить recent_comments в посте (оставить только последний)
db.posts.updateOne(
  { _id: 101 },
  { $set: { recent_comments: [newComment] } }
);
print("Последний комментарий обновлён в посте");

// 5.4 Обновить статистику пользователя
db.users.updateOne(
  { _id: 2 },
  { $inc: { "stats.comments_count": 1 } }
);
print("Статистика пользователя обновлена");

// Проверяем результат
print("\nРезультат после добавления:");
var post = db.posts.findOne({ _id: 101 });
print("Пост (comments_count и recent_comments):");
printjson({ 
  comments_count: post.comments_count,
  recent_comments: post.recent_comments
});

// 6. Получить статистику пользователей
print("\n=== Запрос 6: Статистика пользователей (денормализованные данные) ===");
var result6 = db.users.find({}, { username: 1, stats: 1 }).toArray();
printjson(result6);

print("\n=== Все запросы выполнены ===");
