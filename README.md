# CouponRush

A limited-promo-code service with protection against race conditions.

## Technical focus

This project solves a critical problem, **race conditions**, in distributed systems that hand out limited resources. The main focus is:

- **Atomic operations**: atomic database updates to prevent overselling
- **Database constraints**: UNIQUE constraints to prevent duplicates
- **Connection pooling**: optimization for high load
- **Production practices**: rate limiting, security, validation, error handling

## Architecture

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

## Technologies

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

## Requirements

- Node.js 22+
- Docker Desktop
- npm or yarn

## Setup instructions

### 1. Start the database

```bash
docker compose up -d
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
```

### 3. Start the backend

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### 4. Set up the frontend

```bash
cd client
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3002`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a user
- `POST /auth/login` - Log in

### Campaigns
- `GET /campaigns` - List all campaigns
- `GET /campaigns/:id` - Campaign details
- `POST /campaigns` - Create a campaign (auth required)

### Claims
- `POST /claims` - Claim a coupon (auth required)
- `GET /claims` - My coupons (auth required)

## Testing

### Unit tests
```bash
cd server
npm test
```

### Integration tests
```bash
cd server
npm test -- --run
```

### Stress test (race condition)
```bash
cd server
npm run test:stress
```

## Scripts

### Backend
- `npm run dev` - run the server in development mode
- `npm run build` - build the project
- `npm run start` - run the production version
- `npm run lint` - check the code with the linter
- `npm run format` - format the code
- `npm test` - run unit tests
- `npm run test:stress` - stress test for race conditions

### Frontend
- `npm run dev` - run the dev server
- `npm run build` - production build
- `npm run preview` - preview the production build

## Race Condition Solution

### The problem
When many users request a coupon at the same time, a naive implementation can lead to overselling, handing out more coupons than are available.

### The solution
1. **Atomic update**: `UPDATE campaigns SET issuedCount = issuedCount + 1 WHERE id = ? AND issuedCount < totalCoupons`
2. **UNIQUE constraint**: `UNIQUE(campaign_id, user_id)` to prevent duplicates
3. **Transaction**: Prisma transactions for atomicity
4. **Connection pool**: an increased pool size for high load

### Result
- **Before**: with 20 simultaneous requests for 10 coupons, 15 succeeded (oversold)
- **After**: with 20 simultaneous requests for 10 coupons, 10 succeeded (correct)

## Production Features

- **Rate limiting**: global (100 per 15 min), auth (5 per 15 min), claims (10 per 1 min)
- **Security headers**: Helmet.js for HTTP security headers
- **CORS**: configured for frontend-backend communication
- **Input validation**: Zod schemas for all API endpoints
- **Error handling**: centralized error-handling middleware
- **Authentication**: JWT with access and refresh tokens


