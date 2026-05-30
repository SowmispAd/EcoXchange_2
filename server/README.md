# EcoXchange Backend (Express + MongoDB)

## Prerequisites

- Node.js 18+
- MongoDB running locally or via a cloud connection

## Environment Variables

Create `.env` by copying `.env.example`:

```bash
cp .env.example .env
```

Required:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`

## Install & Run

```bash
cd server
npm install
npm run dev
```

Server starts at:

- `http://localhost:${PORT}`

## API

### Health Check

**GET** `/api/health`

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "data": { "status": "ok" }
}
```

---

### Auth

Base: `/api/auth`

#### Register

**POST** `/api/auth/register`
Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Success (example):

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN_HERE",
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "trial_member"
  }
}
```

#### Login

**POST** `/api/auth/login`
Body:

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

Success (example):

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "trial_member"
  }
}
```

#### Logout

**POST** `/api/auth/logout`
(Uses token; client removes token)

#### Get current user

**GET** `/api/auth/me`
Headers:

- `Authorization: Bearer <JWT_TOKEN>`

Returns authenticated user (password excluded).

#### Update profile

**PUT** `/api/auth/profile`
Headers:

- `Authorization: Bearer <JWT_TOKEN>`

Body (any of):

```json
{
  "name": "Jane Updated",
  "phone": "1234567890",
  "address": "Street 1",
  "avatar": "https://example.com/avatar.png"
}
```

---

### User Profile

Base: `/api/users`

**GET** `/api/users/profile`
Protected route; headers:

- `Authorization: Bearer <JWT_TOKEN>`

Returns authenticated user.

## Notes

- Password hashing is handled with `bcryptjs` in `src/models/User.js`.
- JWT auth middleware is in `src/middleware/authMiddleware.js`.
- Central error handling is in `src/middleware/errorMiddleware.js`.
