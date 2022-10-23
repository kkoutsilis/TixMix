import { Publisher, Subjects, ExpirationCompleteEvent } from "@ktixmix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
