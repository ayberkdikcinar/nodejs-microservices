import { BasePublisher, OrderEvent, Subject } from "@ayberkddtickets/common";

export class OrderCreatedPublisher extends BasePublisher<OrderEvent> {
  subject: Subject.ORDER_CREATED = Subject.ORDER_CREATED;
}
