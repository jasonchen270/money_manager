import express from "express";
import { verifyUser } from "../controllers/userController.js";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  addIncome,
  getIncomes,
  deleteIncome,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add-expense", verifyUser, addExpense);
router.get("/get-expenses", verifyUser, getExpenses);
router.delete("/delete-expense/:id", verifyUser, deleteExpense);
router.post("/add-income", verifyUser, addIncome);
router.get("/get-incomes", verifyUser, getIncomes);
router.delete("/delete-income/:id", verifyUser, deleteIncome);

export { router as transactionRouter };
