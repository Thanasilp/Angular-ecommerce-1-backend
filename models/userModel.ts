import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  address: { type: String, required: true }, // ที่อยู่แบบ text
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, default: "", required: true },
  details: { type: String, default: "" },
});

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: addressSchema, default: null }, //เปลี่ยนเป็น ฯิ่ำแะ
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  createAt: { type: Date, default: Date.now },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
