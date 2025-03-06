import express from "express";
import { addProduct, getProduct } from "../controllers/productController";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.get("/", getProduct);

export default productRouter;
