import { Listener, OrderMailEvent, Subjects } from "@ktixmix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import nodemailer from "nodemailer";

export class OrderMailListener extends Listener<OrderMailEvent> {
  readonly subject = Subjects.OrderMail;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderMailEvent["data"], msg: Message) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
    });

    const info = await transporter.sendMail({
      from: '"TixMix 👻" <automated@tixmix.dev>',
      to: data.userEmail,
      subject: `Order Confirmation ${data.id} ✔`,
      text: `Thank you for you order ${data.id}`,
      html: `<b>Thank you for you order ${data.id}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    msg.ack();
  }
}
