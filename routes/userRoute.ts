import express from "express";
import {
  getUserAddress,
  getUserData,
  loginUser,
  registerUser,
  updateUserAddress,
} from "../controllers/userController";
import validateRegister from "../middlewares/validateRegister";
import validateLogin from "../middlewares/validateLogin";
import authUser from "../middlewares/userAuth";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/login", validateLogin, loginUser);
userRouter.put("/address", authUser, updateUserAddress);
userRouter.get("/", authUser, getUserData);
userRouter.get("/address", authUser, getUserAddress); // ใช้เส้นนี้

export default userRouter;
