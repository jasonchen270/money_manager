import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/userRoutes.js";
import { transactionRouter } from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/users", userRouter);
app.use("/transactions", transactionRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log("Database Connection Error", error));

app.listen(process.env.PORT, () => console.log("Server is Running"));
