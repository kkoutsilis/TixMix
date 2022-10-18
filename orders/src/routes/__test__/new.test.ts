import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for POST req ", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed when a user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a stauts != 401 if user signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});
it("should return an error when ticketId is not provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({})
    .expect(400);
});

it("returns error if ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({ ticketId })
    .expect(404);
});
it("returns error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "test",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "someid",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});
it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "test",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].ticket).toEqual(ticket._id);
  expect(orders[0].status).toEqual(OrderStatus.Created);
  expect(orders[0].userId);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: "test",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
