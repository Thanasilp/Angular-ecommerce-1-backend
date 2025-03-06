import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user in mongoDB
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    //wait for saving new user data
    await newUser.save();

    res.status(201).json({ success: true, message: "Account created!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    //Check wheter there is an account or not
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    //check password and compare password with the existed one
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // ตรวจสอบ JWT_SECRET
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // สร้าง JWT token
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "2h" });

    //Send response
    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email, username: user.username },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { registerUser, loginUser };
