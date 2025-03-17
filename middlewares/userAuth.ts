import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// ขยาย type ของ Request ให้รองรับ `user`
declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // เพิ่ม property user
    }
  }
}

// ฟังก์ชั่นแยกสำหรับดึง token
const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const authUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is missing or invalid",
      });
      return;
    }

    // ตรวจสอบว่า JWT_SECRET ถูกตั้งค่าไว้หรือไม่
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("Server configuration error: JWT_SECRET is missing");
    }

    //ตรสจสอบและถอดรหัส token
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;

    if (!decodedToken.id) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    req.user = { id: decodedToken.id };
    return next();
  } catch (error: any) {
    // ตรวจสอบข้อผิดพลาดของ JWT
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Authentication token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    } else {
      console.error("Authentication error:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// const authUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     // ตรวจสอบว่า header Authorization มีค่าหรือไม่
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//       res.status(401).json({
//         success: false,
//         message: "Authentication token is missing or invalid",
//       });
//       return;
//     }

//     //ดึง token ออกจาก Authorization header
//     const token = authHeader?.split(" ")[1]; // split ทำงานโดยไปหาช่องว่าง ถ้าเจอก็จะทำการตัด แล้ว array ที่เราเลือกคือตำแหน่งที่ 1 ก็คือตัวหลัง

//     // ตรวจสอบว่า JWT_SECRET ถูกตั้งค่าไว้หรือไม่
//     if (!process.env.JWT_SECRET) {
//       throw new Error("Server configuration error: JWT_SECRET is missing");
//     }

//     // ตรวจสอบและถอดรหัส token
//     const decodedToken = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     ) as jwt.JwtPayload;

//     if (!decodedToken.id) {
//       res.status(401).json({ success: false, message: "Invalid token" });
//       return;
//     }

//     req.user = { id: decodedToken.id };

//     next();
//   } catch (error: any) {
//     // ตรวจสอบข้อผิดพลาดของ JWT
//     if (error.name === "TokenExpiredError") {
//       res.status(401).json({
//         success: false,
//         message: "Authentication token has expired",
//       });
//       return;
//     } else if (error.name === "JsonWebTokenError") {
//       res.status(401).json({
//         success: false,
//         message: "Invalid authentication token",
//       });
//       return;
//     }

//     // ข้อผิดพลาดอื่นๆ
//     console.error("Authentication error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export default authUser;
