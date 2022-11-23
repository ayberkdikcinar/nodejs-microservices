import express, { Request, Response } from "express";
import {
  ValidationHandler,
  requireAuth,
  NotFoundError,
  BadRequestError,
} from "@ayberkddtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderStatus } from "@ayberkddtickets/common";
import { OrderCreatedPublisher } from "../events/order-created-publisher";
const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket id must be provided.")],
  ValidationHandler,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    //Find the ticket the user is trying to order in the db
    const isReserved = await ticket.isReserved();

    //Make sure that this ticket is not already reserved.
    if (isReserved) {
      throw new BadRequestError("ticket is not available.");
    }

    //Calculate an expiration date for the order.
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    //Build the order and save it to db
    const orderCreated = Order.build({
      expiresAt,
      status: OrderStatus.Created,
      ticket,
      userId: req.currentUser!.id,
    });

    await orderCreated.save();

    //create nats client
    //emit event order:created
    //await new OrderCreatedPublisher();
    res.send({});
  }
);

export { router as CreateRouter };
