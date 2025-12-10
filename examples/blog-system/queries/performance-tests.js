// =====================================================
// Тесты производительности для сравнения методов
// Использование: mongosh < performance-tests.js
// =====================================================

print("====================================================");
print("  ТЕСТЫ ПРОИЗВОДИТЕЛЬНОСТИ: Embedding vs Referencing");
print("====================================================\n");

// Количество итераций для тестов
var ITERATIONS = 100;

// =====================================================
// ПОДГОТОВКА ДАННЫХ
// =====================================================

// База Embedding
use("perf_embedding");
db.users.drop();

db.users.insertOne({
  _id: 1,
  username: "alice",
  email: "alice@example.com",
  posts: [
    {
      _id: 101,
      title: "Тестовый пост",
      content: "Содержимое поста...",
      comments: [
        { _id: 1001, author: { _id: 2, username: "bob" }, text: "Комментарий 1" },
        { _id: 1002, author: { _id: 3, username: "charlie" }, text: "Комментарий 2" }
      ]
    }
  ]
});

// База Referencing
use("perf_referencing");
db.users.drop();
db.posts.drop();
db.comments.drop();

db.users.insertOne({ _id: 1, username: "alice", email: "alice@example.com" });
db.posts.insertOne({ _id: 101, author_id: 1, title: "Тестовый пост", content: "Содержимое поста..." });
db.comments.insertMany([
  { _id: 1001, post_id: 101, author_id: 2, text: "Комментарий 1" },
  { _id: 1002, post_id: 101, author_id: 3, text: "Комментарий 2" }
]);

print("Данные подготовлены для тестов\n");

// =====================================================
// ТЕСТ 1: ЧТЕНИЕ ПОСТА С КОММЕНТАРИЯМИ
// =====================================================

print("--- ТЕСТ 1: Чтение поста с комментариями ---\n");

// Embedding
use("perf_embedding");
var startEmbedding = new Date();
for (var i = 0; i < ITERATIONS; i++) {
  db.users.findOne({ _id: 1, "posts._id": 101 });
}
var endEmbedding = new Date();
var timeEmbedding = (endEmbedding - startEmbedding) / ITERATIONS;

print("Embedding - Среднее время чтения: " + timeEmbedding.toFixed(3) + " мс");

// Referencing
use("perf_referencing");
var startReferencing = new Date();
for (var i = 0; i < ITERATIONS; i++) {
  db.posts.aggregate([
    { $match: { _id: 101 } },
    { $lookup: { from: "users", localField: "author_id", foreignField: "_id", as: "author" } },
    { $lookup: { from: "comments", localField: "_id", foreignField: "post_id", as: "comments" } }
  ]).toArray();
}
var endReferencing = new Date();
var timeReferencing = (endReferencing - startReferencing) / ITERATIONS;

print("Referencing - Среднее время чтения: " + timeReferencing.toFixed(3) + " мс");
print("Разница: Referencing медленнее в " + (timeReferencing / timeEmbedding).toFixed(2) + " раз\n");

// =====================================================
// ТЕСТ 2: ДОБАВЛЕНИЕ КОММЕНТАРИЯ
// =====================================================

print("--- ТЕСТ 2: Добавление комментария ---\n");

// Embedding
use("perf_embedding");
var startEmbeddingWrite = new Date();
for (var i = 0; i < ITERATIONS; i++) {
  var commentId = 2000 + i;
  db.users.updateOne(
    { _id: 1, "posts._id": 101 },
    { $push: { "posts.$.comments": { _id: commentId, author: { _id: 2, username: "bob" }, text: "Тестовый комментарий " + i } } }
  );
}
var endEmbeddingWrite = new Date();
var timeEmbeddingWrite = (endEmbeddingWrite - startEmbeddingWrite) / ITERATIONS;

print("Embedding - Среднее время записи: " + timeEmbeddingWrite.toFixed(3) + " мс");

// Referencing
use("perf_referencing");
var startReferencingWrite = new Date();
for (var i = 0; i < ITERATIONS; i++) {
  var commentId = 2000 + i;
  db.comments.insertOne({ _id: commentId, post_id: 101, author_id: 2, text: "Тестовый комментарий " + i });
}
var endReferencingWrite = new Date();
var timeReferencingWrite = (endReferencingWrite - startReferencingWrite) / ITERATIONS;

print("Referencing - Среднее время записи: " + timeReferencingWrite.toFixed(3) + " мс");
print("Разница: Embedding медленнее в " + (timeEmbeddingWrite / timeReferencingWrite).toFixed(2) + " раз\n");

// =====================================================
// ИТОГИ
// =====================================================

print("====================================================");
print("  ИТОГИ ТЕСТОВ");
print("====================================================");
print("");
print("| Операция | Embedding | Referencing | Победитель |");
print("|----------|-----------|-------------|------------|");
print("| READ     | " + timeEmbedding.toFixed(3) + " мс   | " + timeReferencing.toFixed(3) + " мс    | " + (timeEmbedding < timeReferencing ? "Embedding" : "Referencing") + " |");
print("| WRITE    | " + timeEmbeddingWrite.toFixed(3) + " мс   | " + timeReferencingWrite.toFixed(3) + " мс    | " + (timeEmbeddingWrite < timeReferencingWrite ? "Embedding" : "Referencing") + " |");
print("");
print("ВЫВОД:");
print("- Для операций ЧТЕНИЯ: Embedding быстрее (один документ)");
print("- Для операций ЗАПИСИ: Referencing быстрее (простая вставка)");
print("");
print("====================================================");

// Очистка тестовых баз
use("perf_embedding");
db.dropDatabase();
use("perf_referencing");
db.dropDatabase();

print("\nТестовые базы данных очищены.");
