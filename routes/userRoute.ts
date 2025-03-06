import express from "express";
import { loginUser, registerUser } from "../controllers/userController";
import validateRegister from "../middlewares/validateRegister";
import validateLogin from "../middlewares/validateLogin";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/login", validateLogin, loginUser);

export default userRouter;
