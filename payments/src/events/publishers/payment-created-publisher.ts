import { Publisher, Subjects, PaymentCreatedEvent } from "@ktixmix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
