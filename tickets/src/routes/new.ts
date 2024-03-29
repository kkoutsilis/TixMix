import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@ktixmix/common";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  body("description").not().isEmpty().withMessage("Description is required"),
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      description,
      userId: req.currentUser!.id,
    });

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
