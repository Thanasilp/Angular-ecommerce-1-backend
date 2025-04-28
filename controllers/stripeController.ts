import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import Stripe from "stripe";

// console.log(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CreatePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "thb",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Convert to satangs (smallest currency unit)
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

const CreatePaymentIntentForMobile = async (req: Request, res: Response): Promise<void> => {
  // ควรจะรับแค่ Amount จาก Flutter เพราะ Items อาจจะไม่ต้องใช้คำนวณที่นี่
  // หรือจะรับ Items มาเพื่อ Validate หรือเก็บ Metadata ก็ได้
  try {
    const { totalAmount, currency = 'thb'} = req.body;
    const userId = req.user?.id; // ดึง userId จาก authUser

    if (!totalAmount || totalAmount <= 0) {
      res.status(400).json({error: 'Invalid amount'});
      return;
    }
    if (!userId) {
      res.status(401).json({error: 'User not authenticated'});
      return;
    }

    // สร้าง Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: currency,
      automatic_payment_methods: { enabled: true},
      metadata: {userId: userId} // อาจจะใส่ orderId ชั่วคราว sinv-hv,^]vnjo
    });

    // ส่งเฉพาะ client_secret กลับไป
    res.json({ clientSecret: paymentIntent.client_secret});
  } catch (error: any) {
    console.error("Error creating PaymentIntent for Mobile:", error.message);
    res.status(500).json({ error: "Failed to create PaymentIntent"});
    
  }
}

export { CreatePaymentIntent, CreatePaymentIntentForMobile };
