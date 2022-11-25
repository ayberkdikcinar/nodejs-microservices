import { BaseListener, Subject, TicketEvent } from "@ayberkddtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends BaseListener<TicketEvent> {
  subject: Subject.TICKET_CREATED = Subject.TICKET_CREATED;
  queueGroupName = "orders-service";
  async onMessage(data: TicketEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();
    msg.ack();
    console.log(data);
  }
}
