import express from "express";
import {
  getUser,
  getUserAddress,
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
userRouter.put("/", authUser, updateUserAddress);
userRouter.get("/", getUser);
userRouter.get("/address", authUser, getUserAddress);

export default userRouter;
