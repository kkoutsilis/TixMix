import { Publisher, Subjects, TicketCreatedEvent } from "@ktixmix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
