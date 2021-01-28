import mongoose from "mongoose";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";

export const getCsrfToken = async () => {
  try {
    const csrfToken = await fetch("http://localhost:3000/api/auth/csrf", {
      method: "GET",
    });
    if (!csrfToken) {
      // return Promise.reject("/auth/credentials-signin?error=Invalid Token");
      return new Error("Invalid token");
    }
    // return Promise.resolve(csrfToken);
    return csrfToken;
  } catch (e) {
    console.log(e);
  }
};

export const sendVerificationRequest = async (email) => {
  try {
    const verification = await fetch(
      "http://localhost:3000/api/auth/signin/email",
      {
        method: "POST",
        body: JSON.stringify({
          csrfToken: await getCsrfToken(),
          email,
        }),
      }
    );
    if (!verification) return new Error("error verifying");
    // return Promise.reject(
    //   "/auth/credentials-signin?error=error sending verification"
    // );

    return verification;
  } catch (e) {
    console.log(e);
  }
};

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
    return false;
  }

  const userExists = await User.findOne({ email }).exec();

  if (userExists) {
    console.log("This account is already registered");
    return false;
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
    return false;
  }

  // console.log("-----✅registered user saved-----");
  // console.log("-----⭕️ testing verification??-----");
  // // FIXME: verification does not get generated to sent
  // const response = await TC(() => sendVerificationRequest(created.email));
  // console.log("🚀 ~ verification: ~ response status:", response.status);

  return Promise.resolve(created);
}

export async function validateCredentials(user) {
  if (mongoose.connections[0].readyState !== 1) {
    await dbConnect();
    console.log("----------🗄 MONGOOSE----------");
  }

  const dbUser = await User.findByEmail(user.email);
  if (!dbUser) return new Error("User not found");
  console.log("-----Signin => validate = user found-----");

  console.log("-----@TODO: check email verification-----");
  // isEmailVerified = !!dbUser?.emailVerified;
  // if (!isEmailVerified) {
  //     isAllowedToLogin = false

  //   console.log("----EMAIL NOT VERIFIED----");
  // }

  console.log("-----validating password-----");
  return await dbUser.validPassword(user.password);
}
