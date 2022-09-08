import request from "supertest";
import { app } from "../../app";

it("response with current user details when authenticated", async () => {
  const singupResponse = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const cookie = singupResponse.get("Set-Cookie");
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
it("response with null when not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send({})
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
