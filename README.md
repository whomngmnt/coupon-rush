# CouponRush

Сервіс лімітованих промокодів з захистом від race conditions.

## Опис

Проект демонструє рішення проблеми race conditions при розподілі обмеженої кількості купонів, коли багато користувачів одночасно намагаються їх отримати.

## Технології

- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Вимоги

- Node.js 22+
- Docker

## Інструкція запуску

1. Запустіть PostgreSQL:

```bash
docker compose up -d
```

2. Встановіть залежності:

```bash
cd server
npm install
```

3. Налаштуйте змінні середовища:

```bash
cp .env.example .env
```

4. Згенеруйте Prisma Client:

```bash
npx prisma generate
```

5. Запустіть сервер:

```bash
npm run dev
```

Сервер буде доступний на `http://localhost:3001`, health-check — `GET /health`.

## Скрипти

- `npm run dev` — запуск серверу в режимі розробки
- `npm run build` — збірка проекту
- `npm run start` — запуск production версії
- `npm run lint` — перевірка коду linter'ом
- `npm run format` — форматування коду
