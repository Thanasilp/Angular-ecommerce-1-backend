import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import connectDB from "./config/mongodb";
import userRouter from "./routes/userRoute";
import connectDB from "./config/mongodb";
import cartRouter from "./routes/cartRoute";
import productRouter from "./routes/productRoute";

// Initialize
dotenv.config();
const app = express();
connectDB();

// Middlewares
app.use(express.json());
const allowedOrigins = ["http://localhost:4200"];

// Configure CORS
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Block the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies or Authorization headers
  })
);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/product", productRouter);

const port: number = parseInt(process.env.PORT as string, 10) || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("API is working");
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
