import express from "express";
import { CreatePaymentIntent, CreatePaymentIntentForMobile } from "../controllers/stripeController";
import authUser from "../middlewares/userAuth";

const stripeRouter = express.Router();

stripeRouter.post("/create-payment-intent",authUser, CreatePaymentIntent);
stripeRouter.post("/create-payment-intent-mobile", authUser, CreatePaymentIntentForMobile);
export default stripeRouter;
