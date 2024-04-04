import { OrderMailListener } from "./events/listeners/order-mail-listener";
import { natsWrapper } from "./nats-wrapper";
import nodemailer from "nodemailer";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined!");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTED_ID must be defined!");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined!");
  }
  if (!process.env.MAIL_HOST) {
    throw new Error("MAIL_HOST must be defined!");
  }
  if (!process.env.MAIL_PORT) {
    throw new Error("MAIL_PORT must be defined!");
  }
  
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!!!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderMailListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
