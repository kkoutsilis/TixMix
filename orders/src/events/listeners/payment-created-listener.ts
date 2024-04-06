import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from "@ktixmix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderUpdatedPublisher } from "../publishers/order-updated-publihser";
import { OrderMailPublisher } from "../publishers/order-mail-publisher";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    await new OrderUpdatedPublisher(this.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    await new OrderMailPublisher(this.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      userEmail: order.userEmail,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
        title: order.ticket.title,
      },
    });

    msg.ack();
  }
}
