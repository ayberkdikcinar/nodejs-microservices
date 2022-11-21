interface Event {
  subject: Subject;
  data: any;
}

enum Subject {
  TICKET_CREATED = "ticket:created",
  TICKET_UPDATED = "ticket:updated",
}

export { Subject, Event };
