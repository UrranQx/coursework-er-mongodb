// =====================================================
// Скрипт заполнения БД: Embedding метод
// Использование: mongosh < seed-blog-embedding.js
// =====================================================

use("blog_embedding");

// Очистка
db.users.drop();

print("=== Заполнение данных для Embedding метода ===");

// Создание пользователей с встроенными постами и комментариями
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
    posts: [
      {
        _id: 101,
        title: "Введение в MongoDB",
        content: "MongoDB - это документоориентированная база данных, которая хранит данные в формате BSON (Binary JSON). В отличие от реляционных баз данных, MongoDB не требует заранее определённой схемы...",
        created_at: new Date("2024-01-20T14:30:00Z"),
        updated_at: new Date("2024-01-20T14:30:00Z"),
        tags: ["mongodb", "nosql", "database", "tutorial"],
        views: 1250,
        likes: 45,
        comments: [
          {
            _id: 1001,
            author: { _id: 2, username: "bob" },
            text: "Отличное введение! Очень понятно объяснено.",
            created_at: new Date("2024-01-20T15:00:00Z"),
            likes: 12
          },
          {
            _id: 1002,
            author: { _id: 3, username: "charlie" },
            text: "Спасибо за статью! Можно ли добавить примеры индексирования?",
            created_at: new Date("2024-01-20T16:00:00Z"),
            likes: 8
          },
          {
            _id: 1003,
            author: { _id: 4, username: "diana" },
            text: "Очень полезно для начинающих.",
            created_at: new Date("2024-01-21T09:00:00Z"),
            likes: 5
          }
        ]
      },
      {
        _id: 102,
        title: "Проектирование схем в MongoDB",
        content: "При проектировании схем в MongoDB важно учитывать паттерны доступа к данным. Существует несколько основных подходов: встраивание (embedding), ссылки (referencing) и гибридный подход...",
        created_at: new Date("2024-01-25T09:00:00Z"),
        updated_at: new Date("2024-01-26T10:00:00Z"),
        tags: ["mongodb", "schema", "design", "best-practices"],
        views: 890,
        likes: 32,
        comments: [
          {
            _id: 1004,
            author: { _id: 2, username: "bob" },
            text: "Отличное продолжение первой статьи!",
            created_at: new Date("2024-01-25T10:00:00Z"),
            likes: 6
          }
        ]
      },
      {
        _id: 103,
        title: "Агрегации в MongoDB",
        content: "Aggregation Pipeline - мощный инструмент для обработки и анализа данных в MongoDB. Он позволяет выполнять сложные преобразования данных через последовательность этапов...",
        created_at: new Date("2024-02-01T11:00:00Z"),
        updated_at: new Date("2024-02-01T11:00:00Z"),
        tags: ["mongodb", "aggregation", "pipeline", "analytics"],
        views: 650,
        likes: 28,
        comments: []
      }
    ]
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
    posts: [
      {
        _id: 201,
        title: "MongoDB в Docker",
        content: "Запуск MongoDB в контейнере Docker - удобный способ развёртывания для разработки и тестирования...",
        created_at: new Date("2024-02-05T08:00:00Z"),
        updated_at: new Date("2024-02-05T08:00:00Z"),
        tags: ["mongodb", "docker", "devops", "containers"],
        views: 420,
        likes: 18,
        comments: [
          {
            _id: 2001,
            author: { _id: 1, username: "alice" },
            text: "Отличный туториал! Добавь пожалуйста docker-compose пример.",
            created_at: new Date("2024-02-05T09:00:00Z"),
            likes: 4
          }
        ]
      }
    ]
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
    posts: []
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
    posts: []
  }
]);

print("Данные успешно загружены!");
print("");
print("Статистика:");
print("- Пользователей: " + db.users.countDocuments());
print("- Постов (встроенных): " + db.users.aggregate([
  { $unwind: { path: "$posts", preserveNullAndEmptyArrays: false } },
  { $count: "total" }
]).toArray()[0]?.total || 0);

print("");
print("Пример запроса: db.users.findOne({username: 'alice'})");
