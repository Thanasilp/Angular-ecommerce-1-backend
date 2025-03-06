import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  category: { type: String },
  description: { type: String },
  imagePublicId: { type: String, required: true }, // เก็บ public_id ของรูปภาพ
  //   image: { type: String },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
