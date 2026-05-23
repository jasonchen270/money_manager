# Money Manager

## What It Does

A full-stack web application where authenticated users can:
- Create an account and log in securely
- Add, view, and delete income and expense transactions (each with title, amount, category, and date)
- View a dashboard with a cumulative balance chart and the five most recent transactions
- Browse full transaction history sorted by date

![dashboard](https://github.com/jasonchen270/money_manager/blob/main/screenshots/dashboard.png?raw=true)

## Built With
- **Frontend**: React, Vite, Styled Components, Recharts, Chart.js, Axios, React Router, date-fns
- **Backend**: Node.js, Express, Mongoose, bcrypt, jsonwebtoken, cookie-parser, cors
- **Database**: MongoDB

## Prerequisites
- Node.js
- npm
- MongoDB

## Installation
1. **Clone the repository**
    ```bash
    git clone https://github.com/jasonchen270/money_manager.git
    cd money_manager
    ```

2. **Create a `.env` file in the `backend` directory**

   Make sure MongoDB is running, then add your connection string, port, and JWT secret:
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

3. Open your browser to [http://localhost:5173](http://localhost:5173) to view the application.
