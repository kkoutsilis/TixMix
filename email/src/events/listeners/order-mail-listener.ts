import { Listener, OrderMailEvent, Subjects } from "@ktixmix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class OrderMailListener extends Listener<OrderMailEvent> {
  readonly subject = Subjects.OrderMail;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderMailEvent["data"], msg: Message) {
    console.log("Send email");
    msg.ack();
  }
}
