import { Request, Response } from "express";
import cartModel from "../models/cartModel";

const getUserCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // รับมาจาก middleware authUser
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const cart = await cartModel.findOne({ userId });
    res
      .status(200)
      .json({ success: true, message: "Received cart data", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // รับมาจาก middleware authUser
    const { productId, name, price, image, quantity } = req.body;

    // ค้นหาตะกร้าของผู้ใช้
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // ถ้ายังไม่มีตะกร้า -> สร้างใหม่
      cart = new cartModel({
        userId,
        items: [{ productId, name, price, image, quantity }],
      });
    } else {
      // ค้นหา item ใน cart ที่เป็นสินค้าตัวเดียวกัน
      const existingItem = cart.items.find((item: any) =>
        item.productId.equals(productId)
      );

      if (existingItem) {
        // ถ้ามีสินค้าในตะกร้าอยู่แล้ว -> เพิ่ม quantity
        existingItem.quantity += quantity;
      } else {
        // ถ้ายังไม่มี -> เพิ่มเป็นสินค้าใหม่
        cart.items.push({ productId, name, price, image, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    const item = cart.items.find((item: any) =>
      item.productId.equals(productId)
    );

    if (!item) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }

    // update product quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    await cartModel.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ success: true, message: "cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      res.json({ success: false, message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, getUserCart, updateQuantity, clearCart, removeFromCart };
