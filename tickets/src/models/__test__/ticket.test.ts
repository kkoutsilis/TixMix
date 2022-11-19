import { Ticket } from "../ticket";

it("implemets optimistic concurrenct control", async () => {
  const ticket = Ticket.build({
    title: "test",
    price: 20,
    userId: "123",
    description: "test",
  });
  await ticket.save();

  const fitstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  fitstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await fitstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Second instance did not throw VersionError");
});

it("should invrement version number", async () => {
  const ticket = Ticket.build({
    title: "test",
    price: 20,
    userId: "123",
    description: "test",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
