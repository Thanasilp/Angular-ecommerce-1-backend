import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, totalAmount, deliveryAddress } = req.body;

    if (!userId || !items || items.length === 0) {
      res.status(400).json({ success: false, message: "Order not found" });
      return;
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

    // update user data and save order
    await userModel.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id },
    });

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

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { address, phone, details } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { address, phone, details },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export { createOrder, getUserOrders, updateOrderStatus, updateUser };
