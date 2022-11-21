import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, ValidationHandler } from "@ayberkddtickets/common";
import { Ticket } from "../models/ticket";

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
    const { title, price } = req.body();

    const ticket = Ticket.build({ title, price, userId: "sd" });
    //TODO: validate the userId
    await ticket.save();

    res.send(ticket);
  }
);

export { router as CreateRouter };
