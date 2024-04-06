import { PaymentCreatedListener } from "../payment-created-listener";
import { PaymentCreatedEvent, OrderStatus } from "@ktixmix/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    userEmail: "test@test.com",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  const data: PaymentCreatedEvent["data"] = {
    id: "someid",
    stripeId: "someid",
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, order, data, msg };
};

it("updates order status to complete", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it("emits an OrderUpdated event", async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
  expect(eventData.status).toEqual(OrderStatus.Complete);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
