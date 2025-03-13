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
    res.status(200).json({
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

const getUser = async (req: Request, res: Response): Promise<void> => {};

const getUserAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await userModel.findById(userId).select("address");

    if (!user || !user.address) {
      res.status(404).json({ success: false, message: "No address found" });
      return;
    }

    res.status(200).json({ success: true, address: user.address });
  } catch (error) {
    res.status(500).json({ message: "Error fetching address", error });
  }
};

const updateUserAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { displayedAddress, lat, lng, phone, details } = req.body;

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { address: { displayedAddress, lat, lng, phone, details } },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: " Address updated",
      address: updateUser.address,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating address", error });
  }
};
export { registerUser, loginUser, getUser, getUserAddress, updateUserAddress };
