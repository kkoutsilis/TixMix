import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getAuthCookie = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const email = "test@test.com";
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
