import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/auth-helper";

it("response with current user details when authenticated", async () => {
  const cookie = await getAuthCookie();
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
