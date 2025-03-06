import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  image: { type: String },
  quantity: { type: Number },
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
