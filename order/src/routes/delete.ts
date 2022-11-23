import {
  requireAuth,
  NotFoundError,
  UnAuthorizedError,
  OrderStatus,
} from "@ayberkddtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId === req.currentUser!.id) {
      throw new UnAuthorizedError();
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();
    res.status(204).send(order);
  }
);

export { router as DeleteRouter };
