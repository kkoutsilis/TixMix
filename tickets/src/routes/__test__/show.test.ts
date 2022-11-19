import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("should return 404 if ticket does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("should return the ticket if it exists", async () => {
  const title = "sometitle";
  const price = 10;
  const description = "test";
  const userId = "someid";
  const ticket = Ticket.build({
    title,
    price,
    description,
    userId,
  });
  ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
