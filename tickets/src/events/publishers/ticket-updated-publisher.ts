import { Publisher, Subjects, TicketUpdatedEvent } from "@ktixmix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
