# Money Manager

A full-stack personal finance tracker (React + Vite frontend, Node/Express + Mongoose backend, MongoDB) where authenticated users log income and expense transactions and visualize a cumulative balance chart alongside their recent and full transaction history.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB 6+

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
