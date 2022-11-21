import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@ayberkddtickets/common";
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  //retrieve tickets.
  const id = req.params.id;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }
  return res.send(ticket);
});

export { router as RetrieveRouter };
