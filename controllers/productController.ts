import { Request, Response } from "express";
import productModel from "../models/productModel";
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsData = req.body; // รับข้อมูลหลายๆ อ็อบเจ็กต์จาก body

    // ใช้ Promise.all เพื่อบันทึกข้อมูลหลายตัวพร้อมกัน
    const products = await Promise.all(
      productsData.map(async (productData: any) => {
        const { name, price, category, description, imagePublicId } =
          productData;

        const product = new productModel({
          name,
          price,
          category,
          description,
          imagePublicId,
        });
        return product.save(); // บันทึก product ลง MongoDB
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Products added", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add products" });
  }
  //   try {
  //     const { name, price, category, description, imagePublicId } = req.body;

  //     const productData = { name, price, category, description, imagePublicId };

  //     // บันทึก product ลง MongoDB
  //     const product = new productModel(productData);
  //     await product.save();

  //     res.status(200).json({ success: true, message: "Product added", product });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ success: false });
  //   }
};

const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // console.log("list product");
    const products = await productModel.find({});

    if (!products.length) {
      // กรณีไม่มีสินค้า
      res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
      });
      return;
    }

    // กรณีดึงสินค้าสำเร็จ
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    // ส่งข้อความผิดพลาดทั่วไป
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
export { addProduct, getProduct };
