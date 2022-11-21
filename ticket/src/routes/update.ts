import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  ValidationHandler,
  UnAuthorizedError,
} from "@ayberkddtickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets:id",
  [
    body("title").not().isEmpty().withMessage("Title must be provided"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),
  ],
  ValidationHandler,
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, price } = req.body();
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

    res.send(ticket);
  }
);

export { router as CreateRouter };
