import { Publisher, OrderCancelledEvent, Subjects } from "@ktixmix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
