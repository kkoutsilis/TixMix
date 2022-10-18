import { Publisher, OrderCreatedEvent, Subjects } from "@ktixmix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
