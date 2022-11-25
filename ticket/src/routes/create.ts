import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, ValidationHandler } from "@ayberkddtickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsClient } from "../services/nats-client";
const router = express.Router();

router.post(
  "/api/tickets",
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

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    //TODO: validate the userId
    await ticket.save();
    await new TicketCreatedPublisher(natsClient.instance).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as CreateRouter };
