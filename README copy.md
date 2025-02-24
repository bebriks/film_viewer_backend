## Command for PrismaORM

```sh
## prisma-studio
npx prisma studio

## prisma migrate up
npx prisma migrate dev --name init
```

## Локальная разработка

### Запуск

```sh
docker-compose up -d
```

### Пересборка

```sh
docker-compose up --build -d
```

### Миграция БД

```sh
docker-compose exec backend-define npx prisma migrate dev --name init
```

### Запуск визуала для бд

```sh
docker-compose exec backend-define npm run prisma:studio
```

### Запуск окружения

```sh
docker-compose up postgres-db minio -d
```

### Картинки

Базово доступны по адресу `http://localhost:9000/shop-define-bucket/название_картинки`
