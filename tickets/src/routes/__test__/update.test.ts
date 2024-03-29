import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getAuthCookie } from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", await getAuthCookie())
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    })
    .expect(404);
});
it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    })
    .expect(401);
});
it("returns 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await getAuthCookie())
    .send({
      title: "validtitple",
      price: 20,
      description: "test",
    })
    .expect(401);
});
it("returns 400 if the user provides invalid input", async () => {
  const cookie = await getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
      description: "test",
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "sometitle",
      price: -20,
      description: "test",
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
      description: "",
    })
    .expect(400);
});
it("updates the ticket when provided valid inputs", async () => {
  const cookie = await getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    });

  const newTitle = "newtitle";
  const newPrice = 45;
  const newDescription = "newDescription";
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
      description: newDescription,
    })
    .expect(200);

  const ticket = await Ticket.findById(response.body.id);
  expect(ticket?.price).toEqual(newPrice);
  expect(ticket?.title).toEqual(newTitle);
  expect(ticket?.description).toEqual(newDescription);
});

it("publishes an event", async () => {
  const cookie = await getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    });

  const newTitle = "newtitle";
  const newPrice = 45;
  const newDescription = "newDescription";
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
      description: newDescription,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if ticket is reserved", async () => {
  const cookie = await getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "validtitle",
      price: 50,
      description: "test",
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  const newTitle = "newtitle";
  const newPrice = 45;
  const newDescription = "test";
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
      description: newDescription,
    })
    .expect(400);
});
