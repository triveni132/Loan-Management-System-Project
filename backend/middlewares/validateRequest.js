import { validationResult } from "express-validator";
import ErrorHandler from "./errorMiddleware.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new ErrorHandler(messages, 400));
  }

  next();
};
