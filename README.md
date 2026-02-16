# BookShelf API

Backend for a book collection management app. Handles user authentication, book browsing with search/filter, and personal reading lists with ratings and comments.

## Tech Stack

- Node.js
- Express 5
- MongoDB (Mongoose)
- JWT authentication
- Joi validation
- bcrypt password hashing

## Project Structure

```
server/
├── index.js                  # Entry point
├── db.js                     # MongoDB connection
├── models/                   # Mongoose schemas
│   ├── book.js
│   ├── user.js
│   └── userBook.js
├── repositories/             # Database access layer
│   ├── bookRepository.js
│   ├── userRepository.js
│   └── userBookRepository.js
├── services/                 # Business logic
│   ├── bookService.js
│   ├── userService.js
│   └── userBookService.js
├── controllers/              # HTTP request handlers
│   ├── bookController.js
│   ├── userController.js
│   └── userBookController.js
├── routes/                   # Route definitions
│   ├── books.js
│   ├── users.js
│   └── userBooks.js
├── middleware/                # Express middleware
│   └── auth.js
└── validators/               # Request validation schemas
    └── authValidator.js
```

### Architecture

```
Request → Route → Controller → Service → Repository → Model → MongoDB
```

Each layer has a single responsibility:

| Layer        | Responsibility                          |
| ------------ | --------------------------------------- |
| Routes       | Map URLs to controller methods          |
| Controllers  | Handle HTTP req/res, call services      |
| Services     | Business logic, data transformation     |
| Repositories | Direct database queries (Mongoose)      |
| Models       | Mongoose schemas and validation         |
| Validators   | Joi schemas for request input           |
| Middleware    | Authentication, error handling          |

## Setup

```bash
npm install
```

Create `.env` file:

```
DB=mongodb://localhost/books
JWTPRIVATEKEY=your-secret-key
SALT=10
```

Run the server:

```bash
npm start
```

Seed books from Google Books API:

```bash
node importGoogleBooks.js
```

## API Endpoints

### Users

| Method | Endpoint             | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| POST   | `/api/users`         | No   | Register new user    |
| POST   | `/api/users/login`   | No   | Login                |
| GET    | `/api/users/me`      | Yes  | Get current user     |

### Books

| Method | Endpoint       | Auth | Description                          |
| ------ | -------------- | ---- | ------------------------------------ |
| GET    | `/api/books`   | No   | List books (search, genre, pagination) |

Query parameters:
- `search` — search by title or author
- `genre` — filter by genre
- `page` — page number (default: 1)
- `limit` — items per page (default: 21)

### User Books (Reading List)

| Method | Endpoint               | Auth | Description              |
| ------ | ---------------------- | ---- | ------------------------ |
| POST   | `/api/userBooks`       | Yes  | Add book to reading list |
| GET    | `/api/userBooks`       | Yes  | Get my reading list      |
| PUT    | `/api/userBooks/:id`   | Yes  | Update rating/comment    |
| DELETE | `/api/userBooks/:id`   | Yes  | Remove from reading list |

Query parameters (GET):
- `rating` — filter by rating (1–5)

## Authentication

JWT-based authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Token is returned on login (`POST /api/users/login`) in the `data` field.

## Environment Variables

| Variable       | Description                    |
| -------------- | ------------------------------ |
| `DB`           | MongoDB connection string      |
| `JWTPRIVATEKEY`| Secret key for JWT signing     |
| `SALT`         | bcrypt salt rounds             |
| `PORT`         | Server port (default: 8080)    |

## Related

- [BookShelf Client (Frontend)](https://github.com/ArsenPorsche/muadDib-library-frontend/blob/main/README.md)
