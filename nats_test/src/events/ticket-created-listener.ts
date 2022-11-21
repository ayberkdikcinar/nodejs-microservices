import { BaseListener, Subject, TicketEvent } from "@ayberkddtickets/common";
import nats from "node-nats-streaming";

export class TicketCreatedListener extends BaseListener<TicketEvent> {
  readonly subject = Subject.TICKET_CREATED;
  queueGroupName = "payments-service";
  onMessage(data: TicketEvent["data"], msg: nats.Message): void {
    console.log("onMessage:", data);
    msg.ack();
  }
}
