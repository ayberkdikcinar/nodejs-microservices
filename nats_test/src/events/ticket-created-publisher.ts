import BasePublisher from "../base/base-publisher";
import { Subject } from "../base/common";

export default class TicketCreatedPublisher extends BasePublisher<TicketEvent> {
  readonly subject = Subject.TICKET_CREATED;
}

interface TicketEvent {
  subject: Subject;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
