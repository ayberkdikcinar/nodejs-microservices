import { BasePublisher, Subject, TicketEvent } from "@ayberkddtickets/common";

export class TicketCreatedPublisher extends BasePublisher<TicketEvent> {
  subject: Subject.TICKET_CREATED = Subject.TICKET_CREATED;
}
