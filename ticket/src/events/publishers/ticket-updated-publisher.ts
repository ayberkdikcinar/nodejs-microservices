import { BasePublisher, Subject, TicketEvent } from "@ayberkddtickets/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketEvent> {
  subject: Subject.TICKET_UPDATED = Subject.TICKET_UPDATED;
}
