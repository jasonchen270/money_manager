import React, { useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../context/globalContext";
import Navigation from "./Navigation";
import styled from "styled-components";
import { format } from "date-fns";
import { Layout } from "../styles/Layout";

const Transactions = () => {
  axios.defaults.withCredentials = true;

  const {
    getTransactionHistorySortedByDateDesc,
    getIncomes,
    getExpenses,
    deleteExpense,
    deleteIncome,
  } = useGlobalContext();

  const [...history] = getTransactionHistorySortedByDateDesc();

  const handleDelete = (id, type) => {
    if (type === "expense") {
      deleteExpense(id);
      getExpenses();
    } else {
      deleteIncome(id);
      getIncomes();
    }
  };

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);
  return (
    <Layout>
      <Navigation />
      <HistoryContainer>
        <h1>Transaction History</h1>

        <ul>
          <li className="list-header">
            <div>Date</div>
            <div>Title</div>
            <div>Category</div>
            <div>Amount</div>
            <div className="edit-header">
              <i className="fa-solid fa-trash"></i>
            </div>
          </li>

          {history.map((item) => {
            const { _id, title, amount, type, date, category } = item;
            let amountText;
            let amountColor;

            if (type === "expense") {
              amountText = `-$${amount <= 0 ? 0 : amount}`;
              amountColor = "var(--expense-color)";
            } else {
              amountText = `+$${amount <= 0 ? 0 : amount}`;
              amountColor = "var(--income-color)";
            }

            // Set date to local timezone
            const newDate = new Date(date);
            newDate.setMinutes(
              newDate.getMinutes() + newDate.getTimezoneOffset()
            );
            const formattedDate = format(newDate, "MM/dd/yyyy");

            return (
              <li key={_id}>
                <div>{formattedDate}</div>
                <div>{title}</div>
                <div>{category}</div>
                <div style={{ color: amountColor }}>{amountText}</div>
                <div className="edit" onClick={() => handleDelete(_id, type)}>
                  <i className="fa-solid fa-trash"></i>
                </div>
              </li>
            );
          })}
        </ul>
      </HistoryContainer>
    </Layout>
  );
};

const HistoryContainer = styled.div`
  padding: 20px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  height: 94vh;
  width: 100%;
  border: 2px solid;
  border-radius: 10px;
  background-color: var(--secondary-color);
  margin-top: 40px;
  margin-right: 40px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding-left: 20px;
    margin-top: 5;
  }

  .list-header {
    font-weight: bold;
    background-color: #10253d;
  }

  ul {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    overflow-y: auto;
    padding-right: 20px;
  }

  ul::-webkit-scrollbar {
    width: 6px;
  }

  ul::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    background-color: var(--third-color);
  }

  li div {
    flex: 1;
    text-align: center;
  }

  .edit {
    cursor: pointer;
    flex: 0;
    margin-right: 20px;
  }

  .edit-header {
    flex: 0;
    margin-right: 20px;
    visibility: hidden;
  }
`;

export default Transactions;
