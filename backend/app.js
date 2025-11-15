import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/auth.router.js";
import loanRouter from "./routes/loan.router.js";
import officerRouter from "./routes/officer.router.js";
import { database } from "./database/db.js";
const corsOption = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();

dotenv.config();

app.use(cors(corsOption));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res, next) => {
  return res.status(200).json({
    success: true,
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/loan", loanRouter);
app.use("/api/v1/officer", officerRouter);

database();

app.use(errorMiddleware);
export default app;
