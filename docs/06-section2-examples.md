# Раздел 2.1-2.2: Примеры проектирования

> Этот файл будет содержать практические примеры реализации для системы управления блогом

## 2.1 Пример: Система управления блогом

### ER-диаграмма

**Сущности:**
- Users (Пользователи)
- Posts (Посты)
- Comments (Комментарии)
- Tags (Теги)

### Описание отношений

| Отношение | Тип | Описание |
|-----------|-----|----------|
| Users → Posts | 1:N | Один пользователь может иметь много постов |
| Posts → Comments | 1:N | Один пост может иметь много комментариев |
| Users → Comments | 1:N | Один пользователь может оставить много комментариев |
| Posts ↔ Tags | M:N | Посты и теги связаны "многие ко многим" |

### Граф связей

```
        CN1 (Users)
           │
           │ 1:N
           ▼
        CN2 (Posts) ←──── M:N ────→ Tags
           │
           │ 1:N
           ▼
        Comments
```

---

## 2.2 РЕАЛИЗАЦИЯ примера

### 2.2.1 Способ встраивания (Embedding)

*Смотри файл: examples/blog-system/01-embedding.json*

**MongoDB запросы:** `examples/blog-system/queries/embedding-queries.js`

### 2.2.2 Способ ссылок (Referencing)

*Смотри файл: examples/blog-system/02-referencing.json*

**MongoDB запросы:** `examples/blog-system/queries/referencing-queries.js`

### 2.2.3 Гибридный подход

*Смотри файл: examples/blog-system/03-hybrid.json*

**MongoDB запросы:** `examples/blog-system/queries/hybrid-queries.js`

### 2.2.4 Workload-driven оптимизация

*Смотри файл: examples/blog-system/04-workload-driven.json*

---

## Анализ производительности

*Содержимое будет добавлено при написании курсовой*

| Метод | READ время | WRITE время | Память |
|-------|------------|-------------|--------|
| Embedding | | | |
| Referencing | | | |
| Hybrid | | | |
| Workload-driven | | | |
