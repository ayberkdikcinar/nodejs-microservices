import { BasePublisher, Subject, TicketEvent } from "@ayberkddtickets/common";

export class TicketCreatedPublisher extends BasePublisher<TicketEvent> {
  readonly subject = Subject.TICKET_CREATED;
}
