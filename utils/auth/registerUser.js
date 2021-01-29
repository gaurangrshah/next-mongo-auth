import mongoose from "mongoose";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";
import { sendVerificationRequest } from './sendVerificationRequest';

export async function registerUser(credentials) {
  console.log("🔵 registering user");
  let creds = credentials.name ? credentials : JSON.parse(credentials);
  const { csrfToken, name, email, password } = creds;
  // console.log({ csrfToken, name, email, password });

  if (mongoose.connections[0].readyState !== 1) {
    await dbConnect();
    console.log("----------🗄 MONGOOSE----------");
  }

  if (!email || !password) {
    console.log("Please provide valid credentials", email, password);
    return Promise.resolve(false);
  }

  const userExists = await User.findOne({ email }).exec();

  if (userExists) {
    console.log("This account is already registered");
    return Promise.resolve(false);
  }

  const doc = {
    name: name ? name : email.split("@")[0],
    username: name ? name : email.split("@")[0],
    email,
    password,
  };

  let created = await new User(doc).save().catch((e) => console.log("err!", e));

  if (!created) {
    console.log("New user could not be registered");
    return Promise.resolve(false);
  }

  console.log("-----✅registered user saved-----");
  console.log("-----⭕️ testing verification??-----");
  // FIXME: verification does not get generated to sent
  const response = await sendVerificationRequest(created.email, csrfToken);
  console.log("🚀 ~ verification: ~ response status:", response.status);

  return Promise.resolve(created);
}
