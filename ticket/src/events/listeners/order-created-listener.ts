import {
  BadRequestError,
  BaseListener,
  OrderEvent,
  Subject,
} from "@ayberkddtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends BaseListener<OrderEvent> {
  subject: Subject.ORDER_CREATED = Subject.ORDER_CREATED;
  queueGroupName = "tickets-service";
  async onMessage(data: OrderEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }
    ticket.set({
      orderId: data.id,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
