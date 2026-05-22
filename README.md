# Money Manager

## Why This Exists

Spreadsheets and banking apps give you raw transaction data, but they do not make it easy to track spending patterns over time or see net balance trends at a glance. This project is a self-hosted personal finance tracker that lets you log income and expenses, categorize them, and visualize running totals -- without handing your data to a third-party service.

## What It Does

A full-stack web application where authenticated users can:
- Create an account and log in securely
- Add, view, and delete income and expense transactions (each with title, amount, category, and date)
- View a dashboard with a cumulative balance chart and the five most recent transactions
- Browse full transaction history sorted by date

![dashboard](https://github.com/jasonchen17/money_manager/blob/main/screenshots/dashboard.png?raw=true)

## Architecture Summary

The application follows a standard client-server architecture with three layers:

```
Browser (React SPA)  --->  Express REST API  --->  MongoDB
        |                        |
   Context API            JWT auth via
   for state              httpOnly cookies
```

- **Frontend**: React 18 single-page application built with Vite. Global state is managed through React Context API (`GlobalProvider`). Styled Components handle CSS-in-JS. Recharts renders the balance area chart on the dashboard.
- **Backend**: Express server exposing two route groups (`/users` for auth, `/transactions` for CRUD). Middleware-based JWT verification protects all transaction endpoints. Passwords are hashed with bcrypt (cost factor 10).
- **Database**: MongoDB via Mongoose with three collections: `users`, `incomes`, `expenses`. Income and expense documents reference their owner via an ObjectId foreign key.

For more detail, see [docs/architecture.md](docs/architecture.md).

## Built With
- **Frontend**: React, Vite, Styled Components, Recharts, Chart.js, Axios, React Router, date-fns
- **Backend**: Node.js, Express, Mongoose, bcrypt, jsonwebtoken, cookie-parser, cors
- **Database**: MongoDB

## How It Works

1. User signs up -- password is hashed with bcrypt and stored in MongoDB. On login, the server creates a JWT containing the user's MongoDB `_id`, signs it, and sets it as an httpOnly cookie.
2. Every protected request sends the cookie automatically. The `verifyUser` middleware decodes the JWT, looks up the user, and attaches `req.user` to the request before passing control to the route handler.
3. Transactions are scoped to the authenticated user (`{ user: req.user._id }`). The frontend fetches incomes and expenses separately, merges them in the Context layer, and derives totals and sorted histories client-side.
4. The dashboard chart iterates day-by-day across the user's transaction date range, accumulating running income, expense, and balance totals, then renders the result as a Recharts `AreaChart`.

## Key Engineering Decisions

- **Separate Income/Expense models** rather than a single Transaction model with a type field. This simplifies queries at the cost of duplicated schema and controller logic. See [docs/decisions.md](docs/decisions.md) for full rationale.
- **Context API over Redux** -- adequate for this scale and avoids extra dependencies.
- **httpOnly cookies for JWT storage** -- prevents XSS-based token theft compared to localStorage.

## Prerequisites
- Node.js
- npm
- MongoDB

## Installation
1. **Clone the repository**
    ```shell
    git clone https://github.com/jasonchen17/money_manager.git

    cd money_manager
    ```

2. **Create a `.env` file in the `backend` directory**
- Make sure MongoDB is running and add your connection string along with the port and JWT secret variable
&nbsp;

    ```text
    MONGO_URL=<your_mongodb_connection_string>
    PORT=3000
    JWT_SECRET=jwttokenkey
    ```

3. **Install backend dependencies**
    ```bash
    cd backend

    npm install
    ```

4. **Install frontend dependencies**
    ```bash
    cd frontend

    npm install
    ```

## Usage
1. **Start the backend server**
    ```bash
    cd backend

    npm start
    ```

2. **Open a second terminal and start the frontend application**
    ```bash
    cd frontend

    npm run dev
    ```

3. **Open your browser and go to [http://localhost:5173](http://localhost:5173) to view the application**

## Limitations

- No transaction editing -- users must delete and re-add to correct a mistake.
- No server-side pagination -- all transactions are fetched at once, which will not scale well for heavy use.
- CORS origin is hardcoded to `http://localhost:5173`; not production-ready without configuration.
- JWT tokens have no expiration set, so sessions persist indefinitely until the cookie is cleared.
- No input sanitization beyond Mongoose schema validation.
- Single-user-at-a-time design with no role-based access control.

## Future Improvements

- Add transaction editing (PUT endpoint).
- Set JWT expiration and implement refresh tokens.
- Add server-side pagination and filtering for the transactions list.
- Support recurring transactions.
- Make CORS origin configurable via environment variable.
- Add unit and integration tests.
