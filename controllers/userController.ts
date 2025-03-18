import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    let { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    // Convert email to lowercase  to avoid duplicate
    email = email.toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ success: false, message: " INvalid Email format" });
      return;
    }

    // Check password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters",
      });
      return;
    }

    // Check if user already exists
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
      address: null, // Ensure address is explicitly set to null
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
    const token = jwt.sign({ id: user._id.toString() }, secretKey, {
      expiresIn: "2h",
    });

    //Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // ดึง userId จ่าก middleware

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, address: user.address }); // response ีuser.address เเอาไปใช้ในหน้า address
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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
    const { name, address, lat, lng, phone, details } = req.body;

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { address: { name, address, lat, lng, phone, details } },
      { new: true }
    );

    // console.log("This is updatedUser from user controller", updateUser);

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
export {
  registerUser,
  loginUser,
  getUserData,
  getUserAddress,
  updateUserAddress,
};
