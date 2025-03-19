import { Request, Response } from "express";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CreatePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

export { CreatePaymentIntent };
