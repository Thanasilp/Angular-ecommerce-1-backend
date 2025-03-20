import express from "express";
import { CreatePaymentIntent } from "../controllers/stripeController";

const stripeRouter = express.Router();

stripeRouter.post("/create-payment-intent", CreatePaymentIntent);

export default stripeRouter;
