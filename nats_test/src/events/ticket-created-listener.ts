import { BaseListener, Subject } from "../base/base-listener";
import nats from "node-nats-streaming";

interface TicketCreatedEvent {
  subject: Subject.TICKET_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subject.TICKET_CREATED;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: nats.Message): void {
    console.log("onMessage:", data);
    msg.ack();
  }
}
