import { BaseListener, Subject, TicketEvent } from "@ayberkddtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends BaseListener<TicketEvent> {
  subject: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;
  queueGroupName = "orders-service";
  async onMessage(data: TicketEvent["data"], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByIdAndPrevVersion(data);

    if (!ticket) {
      throw new Error("Ticket not Found");
    }
    ticket.set({
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
