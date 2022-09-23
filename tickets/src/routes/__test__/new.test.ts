import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getAuthCookie } from "../../test/auth-helper";

it("has a route handler listening to /api/tickets for POST req ", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed when a user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});
it("returns a stauts != 401 if user signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});
it("should return an error when invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ price: 10 })
    .expect(400);
});

it("should return an error when invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ title: "sometitle", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ title: "sometitle" })
    .expect(400);
});
it("creates ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "sometitle";
  const price = 10;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});
