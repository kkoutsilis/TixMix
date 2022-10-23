import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { getAuthCookie } from "../../test/auth-helper";
import { OrderStatus } from "@ktixmix/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns 404 when purchasing order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", await getAuthCookie())
    .send({
      token: "sometoken",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await getAuthCookie())
    .send({
      token: "sometoken",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    price: 20,
    userId: userId,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await getAuthCookie(userId))
    .send({
      token: "sometoken",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 201 with valid request", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price,
    userId: userId,
    status: OrderStatus.AwaitingPayment,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", await getAuthCookie(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();

  expect(response.body.id).toEqual(payment!.id);
});
