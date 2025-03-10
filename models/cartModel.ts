import mongoose from "mongoose";
import userModel from "./userModel";
import productModel from "./productModel";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: productModel,
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
  items: [cartItemSchema],
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
