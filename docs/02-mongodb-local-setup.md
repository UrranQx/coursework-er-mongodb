# MongoDB Community Edition - Локальная установка

## Windows

1. Скачать установщик: https://www.mongodb.com/try/download/community
2. Выбрать платформу Windows, версию MSI
3. Запустить .msi файл
4. Следовать инструкциям установки
5. При вопросе "Install MongoDB as a Service" - ДА
6. MongoDB будет автоматически запускаться при загрузке

Проверка:
```bash
mongosh
```

## macOS

```bash
# Установка через Homebrew (самый простой способ)
brew tap mongodb/brew
brew install mongodb-community

# Запустить сервис
brew services start mongodb-community

# Проверка
mongosh
```

## Linux (Ubuntu/Debian)

```bash
# Добавить репозиторий MongoDB
sudo apt-get install gnupg curl
curl https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Установить
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запустить
sudo systemctl start mongod
sudo systemctl enable mongod

# Проверка
mongosh
```

## Проверка что работает

```bash
mongosh
# Вы должны увидеть
# test>
```

Если видите `test>` - MongoDB работает!

## Запуск сервера вручную (для локальной работы)

Если не хотите автоматического запуска:

```bash
# Запустить сервис
mongod

# Или для macOS
brew services start mongodb-community
```

## Использование mongosh (Shell)

```javascript
// Создать/выбрать БД
use blog

// Создать коллекцию и вставить документ
db.users.insertOne({
  _id: 1,
  username: "alice",
  email: "alice@example.com"
})

// Найти документ
db.users.findOne({username: "alice"})

// Найти все
db.users.find()

// Обновить
db.users.updateOne(
  {username: "alice"},
  {$set: {email: "alice2@example.com"}}
)

// Удалить
db.users.deleteOne({username: "alice"})
```

## Где хранятся данные

- **Windows**: `C:\Program Files\MongoDB\Server\7.0\data`
- **macOS**: `/usr/local/var/mongodb`
- **Linux**: `/var/lib/mongodb`

## Остановка сервера

```bash
# Windows (если запущен как сервис)
net stop MongoDB

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

---

## РЕКОМЕНДАЦИЯ ДЛЯ КУРСОВОЙ

1. **Установить MongoDB Community Edition** один раз
2. **Настроить автоматический запуск** (при загрузке ОС)
3. **Использовать mongosh** для работы с примерами
4. **Запускать скрипты** из папки `examples/blog-system/queries/`

```bash
# Пример запуска скрипта
mongosh < examples/blog-system/queries/embedding-queries.js

# Или интерактивно
mongosh
```
