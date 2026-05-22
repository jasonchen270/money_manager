# Architecture

## Overview

Money Manager is a three-tier web application: a React single-page application communicates with an Express REST API, which persists data in MongoDB.

```
frontend (React/Vite, port 5173)
    |
    |  HTTP (JSON) + httpOnly cookie
    v
backend (Express, port 3000)
    |
    |  Mongoose ODM
    v
MongoDB
```

## Main Components

### Backend

```
backend/
  index.js              -- Express app setup, middleware registration, DB connection
  controllers/
    userController.js    -- signup, login, logout, verifyUser middleware, authorizeUser
    transactionController.js -- addExpense, getExpenses, deleteExpense, addIncome, getIncomes, deleteIncome
  models/
    UserModel.js         -- User schema (name, email, password)
    IncomeModel.js       -- Income schema (title, amount, type, date, category, user ref)
    ExpenseModel.js      -- Expense schema (same shape as Income, type defaults to "expense")
  routes/
    userRoutes.js        -- POST /signup, POST /login, GET /verify, GET /logout
    transactionRoutes.js -- CRUD routes, all protected by verifyUser middleware
```

**Middleware chain for protected routes**: `verifyUser` extracts the JWT from the `token` cookie, decodes it, loads the user from MongoDB, and attaches it to `req.user`. If verification fails, the request is rejected before reaching the controller.

**Model pre-save hooks**: Both `IncomeModel` and `ExpenseModel` have a Mongoose `pre("save")` hook that capitalizes the first letter of the title and lowercases the rest. This enforces consistent display formatting at the data layer.

### Frontend

```
frontend/src/
  main.jsx               -- Entry point; wraps App in GlobalProvider and GlobalStyle
  App.jsx                 -- React Router route definitions
  context/
    globalContext.jsx      -- GlobalProvider (Context API): all shared state and API call functions
  components/
    Home.jsx               -- Landing page
    Login.jsx              -- Login form
    Signup.jsx             -- Registration form
    Dashboard.jsx          -- Balance chart (Recharts AreaChart), recent transactions, totals
    AddTransaction.jsx     -- Form to add income or expense
    Transactions.jsx       -- Full transaction history list with delete
    Navigation.jsx         -- Sidebar navigation
  styles/
    GlobalStyle.js         -- Global CSS via styled-components createGlobalStyle
    Layout.js              -- Shared page layout wrapper (styled-components)
```

## Data Flow

### Authentication flow

1. User submits credentials via Login or Signup form.
2. `globalContext.login()` / `globalContext.signup()` sends a POST to the backend.
3. Backend hashes password (signup) or compares hash (login), creates a JWT with `{ userId }`, and sets it as an httpOnly cookie on the response.
4. Frontend calls `getUser()` which hits `GET /users/verify`. The `verifyUser` middleware decodes the cookie, and `authorizeUser` returns the user object. The context stores it in `user` state.

### Transaction CRUD flow

1. Components call context functions (`addIncome`, `addExpense`, `getIncomes`, `getExpenses`, `deleteIncome`, `deleteExpense`).
2. Context functions make Axios requests to `/transactions/*` endpoints. Cookies are sent automatically via `withCredentials: true`.
3. Backend `verifyUser` middleware authenticates the request, then the controller queries MongoDB scoped to `req.user._id`.
4. After mutations (add/delete), the context re-fetches the full list to keep state in sync.

### Dashboard chart rendering

1. `Dashboard` calls `getIncomes()` and `getExpenses()` on mount via `useEffect`.
2. `getTransactionHistorySortedByDateDesc()` merges and sorts all transactions.
3. The component iterates day-by-day from the earliest to the latest transaction date, accumulating running totals for income, expense, and net balance.
4. The resulting array is passed to Recharts `AreaChart` for rendering.

## External Dependencies

| Dependency | Purpose |
|---|---|
| express | HTTP server and routing |
| mongoose | MongoDB object modeling |
| bcrypt | Password hashing |
| jsonwebtoken | JWT creation and verification |
| cookie-parser | Parse cookies from request headers |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |
| nodemon | Auto-restart server during development |
| react / react-dom | UI framework |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| recharts | Area chart on dashboard |
| chart.js / react-chartjs-2 | Charting library (imported but Recharts is used for the main chart) |
| styled-components | CSS-in-JS styling |
| date-fns | Date formatting and arithmetic |
| react-hot-toast | Toast notifications |
| react-datepicker | Date picker input for transaction forms |
| @fortawesome/* | Icons in the UI |
| vite | Frontend build tool and dev server |

## Design Rationale

**Why Context API instead of Redux?** The application has a small, flat state shape (arrays of incomes and expenses, a user object, an error string). Context API handles this without the boilerplate of Redux actions, reducers, and store configuration.

**Why separate Income and Expense collections?** See [decisions.md](decisions.md) for the full tradeoff analysis. The short version: it keeps queries simple at the cost of duplicated schema definitions.

**Why httpOnly cookies instead of localStorage for JWTs?** httpOnly cookies cannot be read by client-side JavaScript, which eliminates the most common XSS token-theft vector. The tradeoff is that CSRF becomes a concern (not currently mitigated).

**Why no ORM for relationships?** Mongoose `ref` fields are used but `populate()` is never called. Transactions store the user's ObjectId to scope queries, but the application never needs to join user data into transaction responses, so the reference is used purely as a filter.
