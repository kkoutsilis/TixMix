import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper";

const createTicket = async () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", await getAuthCookie())
    .send({ title: "sometitle", price: 10, description: "test" });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
