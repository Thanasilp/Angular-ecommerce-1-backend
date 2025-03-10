import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController";
import validateRegister from "../middlewares/validateRegister";
import validateLogin from "../middlewares/validateLogin";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/login", validateLogin, loginUser);
userRouter.get("/", getUser);

export default userRouter;
