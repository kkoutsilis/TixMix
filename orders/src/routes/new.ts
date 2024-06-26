import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ktixmix/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // check if ticket is reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket already reserved");
    }

    // calc expiration date
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS //TODO use env var
    );
    // save order
    const order = Order.build({
      userId: req.currentUser!.id,
      userEmail: req.currentUser!.email,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // publish event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: ticket.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
