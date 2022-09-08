import request from "supertest";
import { app } from "../../app";

it("returns a 400 with an missing email or/and password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({ password: "password" })
    .expect(400);
  await request(app).post("/api/users/signin").send({}).expect(400);
});

it("fails when an email that does not exist is suplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when incorrect password is suplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "correctpass",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "incorrectpassword",
    })
    .expect(400);
});

it("returns a 201 with cookie on sucessful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
