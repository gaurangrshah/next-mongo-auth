import mongoose from "mongoose";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";
import { updateUser } from "@/controllers/user";


export async function validateCredentials(user) {
  // if (!user.password) {
  //   console.log("plain text pw not found -- exit validation");
  //   return Promise.reject(false);
  // }

  if (mongoose.connections[0].readyState !== 1) {
    await dbConnect();
    console.log("----------🗄 MONGOOSE----------");
  }

  let dbUser = await User.findByEmail(user.email).catch((e) => console.log(e));

  if (!dbUser?.password) {
    console.log("database user has no password on file -- saving new password");
    // return Promise.resolve(false);
    dbUser = await updateUser(dbUser._id, {
      username: user.email.split("@")[0],
      password: user.password,
    });
    console.log("updated user password");
  }
  console.log("-----Signin => validate = user found-----");

  console.log("-----@TODO: check email verification-----");
  // isEmailVerified = dbUser?.emailVerified;
  // if (!isEmailVerified) {
  //     isAllowedToLogin = false

  //   console.log("----EMAIL NOT VERIFIED----");
  // }

  console.log("-----validating password-----");
  return await dbUser.validPassword(user.password).catch((e) => console.log(e));
}
