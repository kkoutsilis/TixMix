import { Publisher, OrderMailEvent, Subjects } from "@ktixmix/common";

export class OrderMailPublisher extends Publisher<OrderMailEvent> {
  readonly subject = Subjects.OrderMail;
}
