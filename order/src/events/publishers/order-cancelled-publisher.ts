import { BasePublisher, OrderEvent, Subject } from "@ayberkddtickets/common";

export class OrderCancelledPublisher extends BasePublisher<OrderEvent> {
  subject: Subject.ORDER_CANCELLED = Subject.ORDER_CANCELLED;
}
