import { Publisher, Subjects, OrderUpdatedEvent } from "@ktixmix/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
