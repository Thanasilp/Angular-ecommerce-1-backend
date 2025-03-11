import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController";
import validateRegister from "../middlewares/validateRegister";
import validateLogin from "../middlewares/validateLogin";
import { updateUser } from "../controllers/orderController";
import authUser from "../middlewares/userAuth";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/login", validateLogin, loginUser);
userRouter.put("/:userId", authUser, updateUser);
userRouter.get("/", getUser);

export default userRouter;
