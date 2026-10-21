# Task Management API

## Setup

Install dependencies:

```bash
npm install
```

Use Node.js 20.13 or newer. Development mode uses Node's built-in watch mode.

Create a `.env` file from `.env.example` and set the PostgreSQL credentials.
The database user must have permission to create a database when using the setup command.

Ensure PostgreSQL is running, then create the database:

```bash
npm run setup:db
```

The application applies its initial schema migration when it connects. Automatic schema synchronization is enabled outside production; production uses the migration.

## Run

Start the application:

```bash
npm start
```

Start in development mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## API

- `GET /` returns service information.
- `GET /tasks` lists tasks.
- `POST /tasks` creates a task. Send JSON with a required `title` and optional string `description`.
- `PUT /tasks/:id/status` updates a task to `Pending` or `Completed`. If `status` is omitted, it defaults to `Completed`.
- `GET /users/email/:email` looks up a user by email address.
- `GET /products` lists products, and `GET /products/:id` retrieves one product.
- `POST /products` creates a product with `name` and `price`; `stock` defaults to `0`.
- `PUT /products/:id` replaces a product with `name`, `price`, and optional `stock`.
- `DELETE /products/:id` deletes a product.
