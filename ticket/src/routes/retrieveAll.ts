import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@ayberkddtickets/common";
const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  //retrieve tickets.
  const ticket = await Ticket.find({});
  if (ticket.length <= 0) {
    throw new NotFoundError();
  }
  return res.send(ticket);
});

export { router as RetrieveAllRouter };
