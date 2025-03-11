import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  details: { type: String, default: "" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
