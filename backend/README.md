# Fastor CRM Backend

REST API for a CRM where counselors register/login, prospective students submit a public enquiry form, and counselors claim enquiries (leads). A claimed enquiry becomes private to that counselor and disappears from the public list.

**Stack:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt, Joi

## Setup

```bash
npm install
cp .env.example .env   # then set MONGO_URI and JWT_SECRET
npm start              # or: npm run dev
```

| Variable         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `PORT`           | Server port (default `5000`)                        |
| `MONGO_URI`      | MongoDB connection string (local or Atlas)          |
| `JWT_SECRET`     | Secret used to sign tokens (min 16 characters)      |
| `JWT_EXPIRES_IN` | Token lifetime (default `1d`)                       |

Environment variables are validated with Joi at startup; the server refuses to boot with a clear message if any are missing or invalid.

## Project structure

```
src/
├── config/        env validation (index.js) and DB connection
├── models/        Mongoose schemas: Employee, Enquiry
├── validations/   Joi schemas per route (body / query / params)
├── middleware/    auth (JWT), validate (Joi), errorHandler
├── services/      business logic and DB access
├── controllers/   thin HTTP layer: call service → send response
├── routes/        route definitions
├── utils/         Res (response helper), ApiError, statusCodes
├── app.js         Express app
└── server.js      bootstrap + graceful shutdown
```

Request flow: `route → auth → validate → controller → service → model`. Services throw `ApiError`s; a single error handler turns every error (ApiError, Mongoose, duplicate key, bad JSON) into the same response shape.

## API

A Postman collection is in [postman/Fastor-CRM.postman_collection.json](postman/Fastor-CRM.postman_collection.json). Import it and run the requests top to bottom: the login token and the new enquiry's id are saved automatically.

Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint                      | Auth | Description                              |
| ------ | ----------------------------- | ---- | ---------------------------------------- |
| POST   | `/api/auth/register`          | No   | Register an employee/counselor           |
| POST   | `/api/auth/login`             | No   | Login, returns JWT                       |
| POST   | `/api/enquiries`              | No   | Public enquiry form submission           |
| GET    | `/api/enquiries/public`       | Yes  | Fetch unclaimed (public) enquiries       |
| PATCH  | `/api/enquiries/:id/claim`    | Yes  | Claim an enquiry for the logged-in user  |
| GET    | `/api/enquiries/private`      | Yes  | Fetch enquiries claimed by logged-in user|
| GET    | `/health`                     | No   | Health check                             |

### Response format

Every response uses the same envelope:

```json
{ "success": true, "message": "Logged in successfully", "data": { ... } }
```

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "email must be a valid email" }] }
```

### Examples

**Register:** `POST /api/auth/register`
```json
{ "name": "Ayushi", "email": "ayushi@example.com", "password": "secret123" }
```
→ `201`, `data: { token, employee: { id, name, email } }`

**Login:** `POST /api/auth/login`
```json
{ "email": "ayushi@example.com", "password": "secret123" }
```
→ `200`, `data: { token, employee }`

**Submit enquiry (public):** `POST /api/enquiries`
```json
{ "name": "Rahul", "email": "rahul@example.com", "phone": "9876543210", "courseInterest": "Full Stack", "message": "Weekend batch?" }
```
`name`, `email`, `courseInterest` are required; `phone`, `message` optional. Unknown fields (e.g. `claimedBy`) are stripped. → `201`

**List enquiries:** `GET /api/enquiries/public?page=1&limit=20` (same for `/private`)
`page` defaults to 1, `limit` to 20 (max 100). → `data: { items: [...], pagination: { page, limit, total, totalPages } }`

**Claim:** `PATCH /api/enquiries/<id>/claim` → `200` on success, `409` if already claimed, `404` if not found.

## Design notes

- An enquiry is **public** when `claimedBy` is `null` and **private** once `claimedBy` is set to an employee.
- Claiming is a single atomic `findOneAndUpdate({ _id, claimedBy: null })`, so if two counselors claim the same lead at the same time, exactly one succeeds and the other gets `409`.
- Compound indexes on `{ claimedBy, createdAt }` and `{ claimedBy, claimedAt }` back both list queries; lists are paginated and use `.lean()`.
- Passwords are hashed with bcrypt, excluded from queries by default (`select: false`), and never returned.
- Emails are trimmed and lowercased, so login is case-insensitive.

## Status codes

`400` validation / bad id / malformed JSON · `401` missing/invalid token or bad credentials · `404` not found · `409` duplicate email or already claimed
