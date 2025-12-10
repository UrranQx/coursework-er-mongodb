// =====================================================
// Скрипт заполнения БД: Hybrid метод
// Использование: mongosh < seed-blog-hybrid.js
// =====================================================

use("blog_hybrid");

// Очистка
db.users.drop();
db.posts.drop();
db.comments.drop();
db.tags.drop();

print("=== Заполнение данных для Hybrid метода ===");

// Коллекция users (с денормализованной статистикой)
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
    created_at: new Date("2024-01-15T10:00:00Z"),
    stats: {
      posts_count: 3,
      comments_count: 1,
      total_likes: 105
    }
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
    created_at: new Date("2024-01-16T11:00:00Z"),
    stats: {
      posts_count: 1,
      comments_count: 2,
      total_likes: 18
    }
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
    created_at: new Date("2024-01-17T12:00:00Z"),
    stats: {
      posts_count: 0,
      comments_count: 1,
      total_likes: 0
    }
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
    created_at: new Date("2024-01-18T13:00:00Z"),
    stats: {
      posts_count: 0,
      comments_count: 1,
      total_likes: 0
    }
  }
]);

// Коллекция posts (с встроенным автором и последними комментариями)
db.posts.insertMany([
  {
    _id: 101,
    // Встроенная информация об авторе (snapshot для быстрого чтения)
    author: {
      _id: 1,
      username: "alice",
      avatar: "/avatars/alice.jpg"
    },
    title: "Введение в MongoDB",
    content: "MongoDB - это документоориентированная база данных, которая хранит данные в формате BSON (Binary JSON). В отличие от реляционных баз данных, MongoDB не требует заранее определённой схемы...",
    created_at: new Date("2024-01-20T14:30:00Z"),
    updated_at: new Date("2024-01-20T14:30:00Z"),
    // Теги встроены как массив строк (быстрый поиск)
    tags: ["mongodb", "nosql", "database", "tutorial"],
    views: 1250,
    likes: 45,
    // Денормализованный счётчик
    comments_count: 3,
    // Последние 2 комментария встроены (preview)
    recent_comments: [
      {
        _id: 1003,
        author: { _id: 4, username: "diana" },
        text: "Очень полезно для начинающих.",
        created_at: new Date("2024-01-21T09:00:00Z")
      },
      {
        _id: 1002,
        author: { _id: 3, username: "charlie" },
        text: "Спасибо за статью! Можно ли добавить примеры индексирования?",
        created_at: new Date("2024-01-20T16:00:00Z")
      }
    ]
  },
  {
    _id: 102,
    author: {
      _id: 1,
      username: "alice",
      avatar: "/avatars/alice.jpg"
    },
    title: "Проектирование схем в MongoDB",
    content: "При проектировании схем в MongoDB важно учитывать паттерны доступа к данным. Существует несколько основных подходов: встраивание (embedding), ссылки (referencing) и гибридный подход...",
    created_at: new Date("2024-01-25T09:00:00Z"),
    updated_at: new Date("2024-01-26T10:00:00Z"),
    tags: ["mongodb", "schema", "design", "best-practices"],
    views: 890,
    likes: 32,
    comments_count: 1,
    recent_comments: [
      {
        _id: 1004,
        author: { _id: 2, username: "bob" },
        text: "Отличное продолжение первой статьи!",
        created_at: new Date("2024-01-25T10:00:00Z")
      }
    ]
  },
  {
    _id: 103,
    author: {
      _id: 1,
      username: "alice",
      avatar: "/avatars/alice.jpg"
    },
    title: "Агрегации в MongoDB",
    content: "Aggregation Pipeline - мощный инструмент для обработки и анализа данных в MongoDB. Он позволяет выполнять сложные преобразования данных через последовательность этапов...",
    created_at: new Date("2024-02-01T11:00:00Z"),
    updated_at: new Date("2024-02-01T11:00:00Z"),
    tags: ["mongodb", "aggregation", "pipeline", "analytics"],
    views: 650,
    likes: 28,
    comments_count: 0,
    recent_comments: []
  },
  {
    _id: 201,
    author: {
      _id: 2,
      username: "bob",
      avatar: "/avatars/bob.jpg"
    },
    title: "MongoDB в Docker",
    content: "Запуск MongoDB в контейнере Docker - удобный способ развёртывания для разработки и тестирования...",
    created_at: new Date("2024-02-05T08:00:00Z"),
    updated_at: new Date("2024-02-05T08:00:00Z"),
    tags: ["mongodb", "docker", "devops", "containers"],
    views: 420,
    likes: 18,
    comments_count: 1,
    recent_comments: [
      {
        _id: 2001,
        author: { _id: 1, username: "alice" },
        text: "Отличный туториал! Добавь пожалуйста docker-compose пример.",
        created_at: new Date("2024-02-05T09:00:00Z")
      }
    ]
  }
]);

// Коллекция comments (отдельная для полного списка и истории)
db.comments.insertMany([
  {
    _id: 1001,
    post_id: 101,
    author: { _id: 2, username: "bob" },
    text: "Отличное введение! Очень понятно объяснено.",
    created_at: new Date("2024-01-20T15:00:00Z"),
    likes: 12
  },
  {
    _id: 1002,
    post_id: 101,
    author: { _id: 3, username: "charlie" },
    text: "Спасибо за статью! Можно ли добавить примеры индексирования?",
    created_at: new Date("2024-01-20T16:00:00Z"),
    likes: 8
  },
  {
    _id: 1003,
    post_id: 101,
    author: { _id: 4, username: "diana" },
    text: "Очень полезно для начинающих.",
    created_at: new Date("2024-01-21T09:00:00Z"),
    likes: 5
  },
  {
    _id: 1004,
    post_id: 102,
    author: { _id: 2, username: "bob" },
    text: "Отличное продолжение первой статьи!",
    created_at: new Date("2024-01-25T10:00:00Z"),
    likes: 6
  },
  {
    _id: 2001,
    post_id: 201,
    author: { _id: 1, username: "alice" },
    text: "Отличный туториал! Добавь пожалуйста docker-compose пример.",
    created_at: new Date("2024-02-05T09:00:00Z"),
    likes: 4
  }
]);

// Коллекция tags (с денормализованными счётчиками)
db.tags.insertMany([
  { _id: 1, name: "mongodb", posts_count: 4 },
  { _id: 2, name: "nosql", posts_count: 1 },
  { _id: 3, name: "database", posts_count: 1 },
  { _id: 4, name: "tutorial", posts_count: 1 },
  { _id: 5, name: "schema", posts_count: 1 },
  { _id: 6, name: "design", posts_count: 1 },
  { _id: 7, name: "best-practices", posts_count: 1 },
  { _id: 8, name: "aggregation", posts_count: 1 },
  { _id: 9, name: "pipeline", posts_count: 1 },
  { _id: 10, name: "analytics", posts_count: 1 },
  { _id: 11, name: "docker", posts_count: 1 },
  { _id: 12, name: "devops", posts_count: 1 },
  { _id: 13, name: "containers", posts_count: 1 }
]);

// Создание индексов
db.posts.createIndex({ "author._id": 1 });
db.posts.createIndex({ tags: 1 });
db.posts.createIndex({ created_at: -1 });
db.comments.createIndex({ post_id: 1 });

print("Данные успешно загружены!");
print("");
print("Статистика:");
print("- Пользователей: " + db.users.countDocuments());
print("- Постов: " + db.posts.countDocuments());
print("- Комментариев: " + db.comments.countDocuments());
print("- Тегов: " + db.tags.countDocuments());

print("");
print("Особенности Hybrid метода:");
print("- Автор встроен в пост (быстрое чтение)");
print("- Последние комментарии встроены (preview)");
print("- Полные комментарии в отдельной коллекции");
print("- Денормализованные счётчики в users и tags");

print("");
print("Пример запроса (БЕЗ $lookup!):");
print("db.posts.findOne({ _id: 101 })");
