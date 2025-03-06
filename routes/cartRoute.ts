import express from "express";
import { addToCart } from "../controllers/cartController";

const cartRouter = express.Router();

cartRouter.post("cart", addToCart);

export default cartRouter;
