# CouponRush

Сервіс лімітованих промокодів з захистом від race conditions.

## Технічний фокус

Цей проект демонструє вирішення критичної проблеми **race conditions** в розподілених системах при розподілі обмежених ресурсів. Основна увага зосереджена на:

- **Atomic operations** - використання атомарних оновлень в базі даних для запобігання oversold
- **Database constraints** - UNIQUE constraints для запобігання дублікатів
- **Connection pooling** - оптимізація для високих навантажень
- **Production practices** - rate limiting, security, validation, error handling

## Архітектура

```
coupon-rush/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth, rate limiting, error handling
│   │   ├── routes/        # API endpoints
│   │   └── lib/           # Utilities (Prisma, JWT, validation)
│   ├── prisma/            # Database schema
│   └── tests/             # Unit & integration tests
├── client/                # Frontend (React + TypeScript + TanStack Query)
│   └── src/
│       ├── components/    # UI components
│       └── App.tsx        # Main application
└── docker-compose.yml     # PostgreSQL configuration
```

## Технології

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)
- **Security**: Helmet.js, CORS, express-rate-limit
- **Validation**: Zod
- **Testing**: Vitest (unit), Supertest (integration)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: TanStack Query
- **HTTP Client**: Axios
- **Build Tool**: Vite

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## Вимоги

- Node.js 22+
- Docker Desktop
- npm or yarn

## Інструкція запуску

### 1. Запуск бази даних

```bash
docker compose up -d
```

### 2. Налаштування backend

```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
```

### 3. Запуск backend

```bash
npm run dev
```

Backend буде доступний на `http://localhost:3001`

### 4. Налаштування frontend

```bash
cd client
npm install
```

### 5. Запуск frontend

```bash
npm run dev
```

Frontend буде доступний на `http://localhost:3002`

## API Endpoints

### Authentication
- `POST /auth/register` - Реєстрація користувача
- `POST /auth/login` - Вхід в систему

### Campaigns
- `GET /campaigns` - Список всіх кампаній
- `GET /campaigns/:id` - Деталі кампанії
- `POST /campaigns` - Створення кампанії (auth required)

### Claims
- `POST /claims` - Отримання купона (auth required)
- `GET /claims` - Мої купони (auth required)

## Тестування

### Unit тести
```bash
cd server
npm test
```

### Integration тести
```bash
cd server
npm test -- --run
```

### Stress тест (race condition)
```bash
cd server
npm run test:stress
```

## Скрипти

### Backend
- `npm run dev` - запуск серверу в режимі розробки
- `npm run build` - збірка проекту
- `npm run start` - запуск production версії
- `npm run lint` - перевірка коду linter'ом
- `npm run format` - форматування коду
- `npm test` - запуск unit тестів
- `npm run test:stress` - stress тест для race conditions

### Frontend
- `npm run dev` - запуск dev серверу
- `npm run build` - збірка для production
- `npm run preview` - preview production build

## Race Condition Solution

### Проблема
При одночасних запитах від багатьох користувачів на отримання купона, наївна реалізація може призвести до oversold - видачі більше купонів, ніж доступно.

### Рішення
1. **Atomic Update**: `UPDATE campaigns SET issuedCount = issuedCount + 1 WHERE id = ? AND issuedCount < totalCoupons`
2. **UNIQUE Constraint**: `UNIQUE(campaign_id, user_id)` для запобігання дублікатів
3. **Transaction**: Використання Prisma транзакцій для атомарності
4. **Connection Pool**: Збільшений пул з'єднань для високих навантажень

### Результат
- **Before**: При 20 одночасних запитах на 10 купонів - 15 успішних (oversold)
- **After**: При 20 одночасних запитах на 10 купонів - 10 успішних (correct)

## Production Features

- **Rate Limiting**: Глобальний (100/15min), Auth (5/15min), Claims (10/1min)
- **Security Headers**: Helmet.js для HTTP заголовків безпеки
- **CORS**: Налаштований CORS для frontend-backend зв'язку
- **Input Validation**: Zod schemas для всіх API endpoint
- **Error Handling**: Централізований error handling middleware
- **Authentication**: JWT з access та refresh tokens

## License

MIT
