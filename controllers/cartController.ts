import { Request, Response } from "express";

const addToCart = async (reg: Request, res: Response): Promise<void> => {
  try {
    const {} = reg.body;
  } catch (error) {}
};

export { addToCart };
