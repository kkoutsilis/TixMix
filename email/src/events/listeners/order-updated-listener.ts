import { Listener, OrderUpdatedEvent, Subjects } from "@ktixmix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderUpdatedEvent["data"], msg: Message) {
    if (data.status == "complete") {
      // get user id data.userId and request to get email
      // get ticket id data.ticket.id and request to get info

      console.log("Send email");
    }
    msg.ack();
  }
}
