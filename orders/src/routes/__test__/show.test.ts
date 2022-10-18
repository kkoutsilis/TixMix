import { getAuthCookie } from "../../test/auth-helper";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns an error when invalid id provided", async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${id}`)
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", await getAuthCookie())
    .expect(401);
});
it("returns requested order", async () => {
  const ticket = Ticket.build({ title: "test", price: 20 });
  await ticket.save();

  const cookie = await getAuthCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
