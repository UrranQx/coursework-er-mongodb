// =====================================================
// Скрипт заполнения БД: Referencing метод
// Использование: mongosh < seed-blog-referencing.js
// =====================================================

use("blog_referencing");

// Очистка
db.users.drop();
db.posts.drop();
db.comments.drop();
db.tags.drop();

print("=== Заполнение данных для Referencing метода ===");

// Коллекция users
db.users.insertMany([
  {
    _id: 1,
    username: "alice",
    email: "alice@example.com",
    profile: {
      full_name: "Алиса Иванова",
      avatar: "/avatars/alice.jpg",
      bio: "Разработчик и блогер"
    },
    created_at: new Date("2024-01-15T10:00:00Z")
  },
  {
    _id: 2,
    username: "bob",
    email: "bob@example.com",
    profile: {
      full_name: "Борис Петров",
      avatar: "/avatars/bob.jpg",
      bio: "DevOps инженер"
    },
    created_at: new Date("2024-01-16T11:00:00Z")
  },
  {
    _id: 3,
    username: "charlie",
    email: "charlie@example.com",
    profile: {
      full_name: "Карл Сидоров",
      avatar: "/avatars/charlie.jpg",
      bio: "Аналитик данных"
    },
    created_at: new Date("2024-01-17T12:00:00Z")
  },
  {
    _id: 4,
    username: "diana",
    email: "diana@example.com",
    profile: {
      full_name: "Диана Козлова",
      avatar: "/avatars/diana.jpg",
      bio: "Full-stack разработчик"
    },
    created_at: new Date("2024-01-18T13:00:00Z")
  }
]);

// Коллекция tags
db.tags.insertMany([
  { _id: 1, name: "mongodb", slug: "mongodb" },
  { _id: 2, name: "nosql", slug: "nosql" },
  { _id: 3, name: "database", slug: "database" },
  { _id: 4, name: "tutorial", slug: "tutorial" },
  { _id: 5, name: "schema", slug: "schema" },
  { _id: 6, name: "design", slug: "design" },
  { _id: 7, name: "best-practices", slug: "best-practices" },
  { _id: 8, name: "aggregation", slug: "aggregation" },
  { _id: 9, name: "pipeline", slug: "pipeline" },
  { _id: 10, name: "analytics", slug: "analytics" },
  { _id: 11, name: "docker", slug: "docker" },
  { _id: 12, name: "devops", slug: "devops" },
  { _id: 13, name: "containers", slug: "containers" }
]);

// Коллекция posts
db.posts.insertMany([
  {
    _id: 101,
    author_id: 1,
    title: "Введение в MongoDB",
    content: "MongoDB - это документоориентированная база данных, которая хранит данные в формате BSON (Binary JSON). В отличие от реляционных баз данных, MongoDB не требует заранее определённой схемы...",
    created_at: new Date("2024-01-20T14:30:00Z"),
    updated_at: new Date("2024-01-20T14:30:00Z"),
    tag_ids: [1, 2, 3, 4],
    views: 1250,
    likes: 45
  },
  {
    _id: 102,
    author_id: 1,
    title: "Проектирование схем в MongoDB",
    content: "При проектировании схем в MongoDB важно учитывать паттерны доступа к данным. Существует несколько основных подходов: встраивание (embedding), ссылки (referencing) и гибридный подход...",
    created_at: new Date("2024-01-25T09:00:00Z"),
    updated_at: new Date("2024-01-26T10:00:00Z"),
    tag_ids: [1, 5, 6, 7],
    views: 890,
    likes: 32
  },
  {
    _id: 103,
    author_id: 1,
    title: "Агрегации в MongoDB",
    content: "Aggregation Pipeline - мощный инструмент для обработки и анализа данных в MongoDB. Он позволяет выполнять сложные преобразования данных через последовательность этапов...",
    created_at: new Date("2024-02-01T11:00:00Z"),
    updated_at: new Date("2024-02-01T11:00:00Z"),
    tag_ids: [1, 8, 9, 10],
    views: 650,
    likes: 28
  },
  {
    _id: 201,
    author_id: 2,
    title: "MongoDB в Docker",
    content: "Запуск MongoDB в контейнере Docker - удобный способ развёртывания для разработки и тестирования...",
    created_at: new Date("2024-02-05T08:00:00Z"),
    updated_at: new Date("2024-02-05T08:00:00Z"),
    tag_ids: [1, 11, 12, 13],
    views: 420,
    likes: 18
  }
]);

// Коллекция comments
db.comments.insertMany([
  {
    _id: 1001,
    post_id: 101,
    author_id: 2,
    text: "Отличное введение! Очень понятно объяснено.",
    created_at: new Date("2024-01-20T15:00:00Z"),
    likes: 12
  },
  {
    _id: 1002,
    post_id: 101,
    author_id: 3,
    text: "Спасибо за статью! Можно ли добавить примеры индексирования?",
    created_at: new Date("2024-01-20T16:00:00Z"),
    likes: 8
  },
  {
    _id: 1003,
    post_id: 101,
    author_id: 4,
    text: "Очень полезно для начинающих.",
    created_at: new Date("2024-01-21T09:00:00Z"),
    likes: 5
  },
  {
    _id: 1004,
    post_id: 102,
    author_id: 2,
    text: "Отличное продолжение первой статьи!",
    created_at: new Date("2024-01-25T10:00:00Z"),
    likes: 6
  },
  {
    _id: 2001,
    post_id: 201,
    author_id: 1,
    text: "Отличный туториал! Добавь пожалуйста docker-compose пример.",
    created_at: new Date("2024-02-05T09:00:00Z"),
    likes: 4
  }
]);

// Создание индексов
db.posts.createIndex({ author_id: 1 });
db.posts.createIndex({ tag_ids: 1 });
db.posts.createIndex({ created_at: -1 });
db.comments.createIndex({ post_id: 1 });
db.comments.createIndex({ author_id: 1 });

print("Данные успешно загружены!");
print("");
print("Статистика:");
print("- Пользователей: " + db.users.countDocuments());
print("- Постов: " + db.posts.countDocuments());
print("- Комментариев: " + db.comments.countDocuments());
print("- Тегов: " + db.tags.countDocuments());

print("");
print("Пример запроса с $lookup:");
print("db.posts.aggregate([");
print("  { $match: { _id: 101 } },");
print("  { $lookup: { from: 'users', localField: 'author_id', foreignField: '_id', as: 'author' } },");
print("  { $lookup: { from: 'comments', localField: '_id', foreignField: 'post_id', as: 'comments' } }");
print("])");
