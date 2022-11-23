import { NotFoundError, UnAuthorizedError } from "@ayberkddtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId === req.currentUser!.id) {
    throw new UnAuthorizedError();
  }
  res.send(order);
});

export { router as RetrieveRouter };
