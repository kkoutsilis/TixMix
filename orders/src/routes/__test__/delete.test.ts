import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { getAuthCookie } from "../../test/auth-helper";
import { Order, OrderStatus } from "../../models/order";

it("returns an error when invalid id provided", async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", await getAuthCookie())
    .expect(404);
});

it("returns an error when user does not own the order", async () => {
  const ticket = Ticket.build({ title: "test", price: 20 });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", await getAuthCookie())
    .expect(401);
});

it("returns an canceled oreder with 204", async () => {
  const ticket = Ticket.build({ title: "test", price: 20 });
  await ticket.save();

  const cookie = await getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");
