import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  ValidationHandler,
  UnAuthorizedError,
} from "@ayberkddtickets/common";
import { Ticket } from "../models/ticket";
import { natsClient } from "../services/nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
const router = express.Router();

router.put(
  "/api/tickets/:id",
  [
    body("title").not().isEmpty().withMessage("Title must be provided"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),
  ],
  ValidationHandler,
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const id = req.params.id;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();
    await new TicketUpdatedPublisher(natsClient.instance).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.send(ticket);
  }
);

export { router as UpdateRouter };
