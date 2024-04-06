import { Listener, OrderMailEvent, Subjects } from "@ktixmix/common";
import { Message } from "node-nats-streaming";
import nodemailer from "nodemailer";
import { generateOrderEmailTemplate } from "../../templates/template";
import { queueGroupName } from "./queue-group-name";

export class OrderMailListener extends Listener<OrderMailEvent> {
  readonly subject = Subjects.OrderMail;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderMailEvent["data"], msg: Message) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
    });

    try {
      const htmlBody = generateOrderEmailTemplate(data);
      const info = await transporter.sendMail({
        from: '"TixMix 🎫" <automated@tixmix.dev>',
        to: data.userEmail,
        subject: `Order Confirmation ${data.id} ✔`,
        html: htmlBody,
      });
      console.log("Email sent: %s", info.messageId);
    } catch (err) {
      console.log("Failed to send email %s", err);
    }
    msg.ack();
  }
}
