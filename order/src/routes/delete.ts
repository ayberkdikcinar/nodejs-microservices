import {
  requireAuth,
  NotFoundError,
  UnAuthorizedError,
  OrderStatus,
} from "@ayberkddtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events//publishers/order-cancelled-publisher";
import { natsClient } from "../services/nats-client";
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

    new OrderCancelledPublisher(natsClient.instance).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    res.status(204).send(order);
  }
);

export { router as DeleteRouter };
