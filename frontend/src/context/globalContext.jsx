import React, { useContext, useState } from "react";
import axios from "axios";

const USER_BASE_URL = "http://localhost:3000/users/";
const TRANSACTION_BASE_URL = "http://localhost:3000/transactions/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const addExpense = async (expense) => {
    try {
      const response = await axios.post(
        `${TRANSACTION_BASE_URL}add-expense`,
        expense,
        { withCredentials: true }
      );

      getExpenses();
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${TRANSACTION_BASE_URL}get-expenses`);

      setExpenses(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const addIncome = async (income) => {
    try {
      const response = await axios.post(
        `${TRANSACTION_BASE_URL}add-income`,
        income,
        { withCredentials: true }
      );

      getIncomes();
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  const getIncomes = async () => {
    try {
      const response = await axios.get(`${TRANSACTION_BASE_URL}get-incomes`);

      setIncomes(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const getTransactionHistoryByCreatedAtDesc = () => {
    const history = [...incomes, ...expenses];

    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history;
  };

  const getTransactionHistorySortedByDateDesc = () => {
    const history = [...incomes, ...expenses];

    // Sort the history array by date in descending order
    history.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return history;
  };

  const deleteIncome = async (id) => {
    try {
      const response = await axios.delete(
        `${TRANSACTION_BASE_URL}delete-income/${id}`
      );

      getIncomes();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await axios.delete(
        `${TRANSACTION_BASE_URL}delete-expense/${id}`
      );

      getExpenses();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const totalIncome = incomes.reduce(
    (total, income) => total + income.amount,
    0
  );

  const totalBalance = totalIncome - totalExpense;

  const getUser = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}verify`, {
        withCredentials: true,
      });

      setUser(response.data.user);
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${USER_BASE_URL}signup`, userData, {
        withCredentials: true,
      });

      getUser();
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post(`${USER_BASE_URL}login`, userData, {
        withCredentials: true,
      });

      getUser();
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(`${USER_BASE_URL}logout`, {
        withCredentials: true,
      });
      
      setUser(null);
      return true;
    } catch (error) {
      setError(error.response.data.message);
      return false;
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        incomes,
        setIncomes,
        expenses,
        setExpenses,
        error,
        setError,
        user,
        setUser,
        addExpense,
        getExpenses,
        addIncome,
        getIncomes,
        getTransactionHistorySortedByDateDesc,
        deleteIncome,
        deleteExpense,
        totalExpense,
        totalIncome,
        totalBalance,
        signup,
        login,
        getUser,
        logout,
        getTransactionHistoryByCreatedAtDesc,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
