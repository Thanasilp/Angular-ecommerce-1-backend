import express from "express";
import {
  addToCart,
  getUserCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController";
import authUser from "../middlewares/userAuth";

const cartRouter = express.Router();

cartRouter.get("/", authUser, getUserCart);
cartRouter.post("/", authUser, addToCart);
cartRouter.delete("/:productId", authUser, removeFromCart);
cartRouter.delete("/", authUser, clearCart);
cartRouter.put("/", authUser, updateQuantity);

export default cartRouter;
