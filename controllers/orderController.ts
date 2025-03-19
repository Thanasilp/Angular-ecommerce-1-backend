import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import cartModel from "../models/cartModel";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!userId || !items || items.length === 0) {
      res.status(400).json({ success: false, message: "Order not found" });
      return;
    }

    // ดึงข้อมูล cart ของลูกค้า
    const userCart = await cartModel.findOne({ userId });

    if (!userCart || userCart.items.length === 0) {
      res.status(400).json({ success: false, message: "No cart found" });
    }

    // create a new order
    const newOrder = new orderModel({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    await cartModel.findOneAndDelete({ userId });

    res
      .status(201)
      .json({ sucess: true, message: "Order created", savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server issue", error });
  }
};

const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const orders = await orderModel
      .find({ userId })
      .populate("items.productId");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server issue", error });
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ success: false, message: "No order found" });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server issue", error });
  }
};

// function name(params:type) {

// }
export { createOrder, getUserOrders, updateOrderStatus };
