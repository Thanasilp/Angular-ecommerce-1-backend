import express from "express";
import {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import authUser from "../middlewares/userAuth";
const oderRouter = express.Router();

oderRouter.post("/", authUser, createOrder);
oderRouter.get("/", authUser, getUserOrders);
oderRouter.put("/", updateOrderStatus);

export default oderRouter;
