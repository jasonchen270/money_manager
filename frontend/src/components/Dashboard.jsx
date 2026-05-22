import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/globalContext";
import Navigation from "./Navigation";
import "chart.js/auto";
import { format, addDays } from "date-fns";
import styled from "styled-components";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Layout } from "../styles/Layout";

const Dashboard = () => {
  axios.defaults.withCredentials = true;

  const {
    totalIncome,
    getIncomes,
    getExpenses,
    totalExpense,
    getTransactionHistorySortedByDateDesc,
  } = useGlobalContext();

  const [...history] = getTransactionHistorySortedByDateDesc().reverse();
  const slicedHistory = getTransactionHistorySortedByDateDesc().slice(0, 5);

  const chartData = [];

  // Get date range for chart
  let start;
  let end;

  history.forEach((transaction) => {
    if (!start) {
      start = new Date(transaction.date);
    }
    end = new Date(transaction.date);
  });

  let chartTotalIncome = 0;
  let chartTotalExpense = 0;
  let chartTotalBalance = 0;

  for (let cur = start; cur <= addDays(end, 1); cur = addDays(cur, 1)) {
    history.forEach((transaction) => {
      const { amount, type, date } = transaction;
      const temp = format(new Date(date), "MM-dd-yyyy");

      if (temp === format(cur, "MM-dd-yyyy")) {
        if (type === "income") {
          chartTotalIncome += amount;
          chartTotalBalance += amount;
        } else if (type === "expense") {
          chartTotalExpense += amount;
          chartTotalBalance -= amount;
        }
      }
    });

    chartData.push({
      date: format(cur, "MM-dd-yyyy"),
      chartTotalBalance,
      chartTotalIncome,
      chartTotalExpense,
    });
  }

  const getTicks = (data) => {
    const dataLength = data.length;
    const tickCount = 5;
    
    if (dataLength <= tickCount) {
      return data.map((item) => item.date);
    }
    
    const middleIndex = Math.floor(dataLength / 2);
    const step = Math.floor((dataLength - 1) / (tickCount - 1));
    const ticks = [data[middleIndex].date];
    
    let leftIndex = middleIndex;
    let rightIndex = middleIndex;
  
    while (leftIndex - step >= 0 && rightIndex + step < dataLength - 1) {
      leftIndex -= step;
      ticks.unshift(data[leftIndex].date);
    
      rightIndex += step;
      ticks.push(data[rightIndex].date);
    }
    
    return ticks.slice(0, tickCount);
  };

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);
  return (
    <Layout>
      <Navigation />
      <DashboardContainer>
        <h1>Dashboard</h1>

        <div className="chart-history-container">
          <div className="chart-container">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                    <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="chartTotalBalance"
                  stroke="#2451B7"
                  fill="url(#color)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  ticks={getTicks(chartData)}
                  tickFormatter={(date) => format(new Date(date), "MMM, d")}
                />
                <YAxis
                  dataKey="chartTotalIncome"
                  axisLine={false}
                  tickLine={false}
                  tickCount={8}
                  tickFormatter={(number) => `$${number}`}
                  width={100}
                />
                <Tooltip content={CustomTooltip} />
                <CartesianGrid opacity={0.1} vertical={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="history-container">
            <h2>Past 5 transactions</h2>
            <ul>
              {slicedHistory.map((item) => {
                const { _id, title, amount, type } = item;
                let amountText;
                let amountColor;

                if (type === "expense") {
                  amountText = `-$${amount <= 0 ? 0 : amount}`;
                  amountColor = "var(--expense-color)";
                } else {
                  amountText = `+$${amount <= 0 ? 0 : amount}`;
                  amountColor = "var(--income-color)";
                }

                return (
                  <li key={_id}>
                    <div>{title}</div>
                    <div style={{ color: amountColor }}>{amountText}</div>
                  </li>
                );
              })}
            </ul>

            <Link to="/transactions">View all transactions</Link>
          </div>
        </div>

        <ul className="totals-container">
          <li>
            <h2 className="income">Total Income</h2>
            <p>${totalIncome}</p>
          </li>

          <li>
            <h2 className="expenses">Total Expenses</h2>
            <p>${totalExpense}</p>
          </li>

          <li>
            <h2>Total Balance</h2>
            <p>${totalIncome - totalExpense}</p>
          </li>
        </ul>
      </DashboardContainer>
    </Layout>
  );
};

function CustomTooltip({ active, payload, label }) {
  if (active) {
    return (
      <div className="tooltip">
        <h4>{format(label, "eeee, d MMM, yyyy")}</h4>

        <p>
          <strong>Total Balance: </strong> ${payload[0].value}
        </p>

        <p>
          <strong>Total Income: </strong> ${payload[0].payload.chartTotalIncome}
        </p>

        <p>
          <strong>Total Expense: </strong> $
          {payload[0].payload.chartTotalExpense}
        </p>
      </div>
    );
  }
}

const DashboardContainer = styled.div`
  padding: 20px;
  padding-left: 40px;
  display: block;
  flex-direction: column;
  border: 2px solid;
  border-radius: 10px;
  background-color: var(--secondary-color);
  width: 100%;
  margin-top: 40px;
  margin-right: 40px;
  height: 94vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding-left: 20px;
    margin-top: 5;
  }

  h1 {
    margin-bottom: 20px;
  }

  .menu-toggle {
    display: none;
    cursor: pointer;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .chart-history-container {
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .chart-container {
    border-radius: 10px;
    border: 2px solid;
    padding: 30px;
    flex: 1;

    @media (max-width: 768px) {
      margin-bottom: 20px;
    }
  }

  .history-container {
    padding: 20px;
    padding-top: 0px;
    margin-left: 20px;
    flex: 1;

    @media (max-width: 768px) {
      margin-left: 0;
    }

    a {
      display: block;
      text-decoration: none;
      margin-top: 15px;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      background-color: var(--button-color);
    }
  }

  .history-container ul {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  .history-container li {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    background-color: var(--third-color);
  }

  .history-container li div {
    margin: 0 10px;
  }

  .totals-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
    flex-direction: column;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .totals-container li {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    background-color: var(--third-color);
    width: 50%;

    @media (max-width: 768px) {
      margin-right: 0;
    }
  }

  .totals-container li:last-child {
    margin-right: 0;
  }

  .totals-container li p {
    font-size: 24px;
    margin-top: 10px;
  }

  .income {
    color: #228b22;
  }

  .expenses {
    color: #b22222;
  }

  .tooltip {
    border-radius: 10px;
    background-color: #26313c;
    color: #fff;
    padding: 1rem;
    box-shadow: 15px 30px 40px 5px rgba(0, 0, 0, 0.5);
    text-align: left;
    h4 {
      margin-bottom: 10px;
      text-align: center;
    }
  }
`;

export default Dashboard;
