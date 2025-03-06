import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { RegisterData } from "../types/auth";

//รูปแบบของ Request ใน TS
//Request<ParamsDictionary, ResBody, ReqBody, QueryString>
//เราเลยเขียนแบบนี้ไม่ได้ req: Request<RegisterData> สองพารามิเตอร์แรกถูกจองโดยตัวอื่นไปแล้ว

const validateRegister = (
  req: Request<{}, {}, RegisterData>,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    res
      .status(400)
      .json({ success: false, message: "Please enter a valid email" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
    return;
  }

  next();
};

export default validateRegister;
