import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dbConnect from "@/utils/mongoose";
import User from "@/models/user";
import TC from "@/utils/trycatch";

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

export async function crossCheckPassword(password, user) {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) return Promise.resolve(isValidPassword);
    return Promise.reject("/auth/credentials-signin?error=Invalid Password");
  } catch (e) {
    console.log("pw e", e);
  }
}

// export async function registerUser(name, email, password) {
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

export const authorizeUserBasedOnStatus = async (credentials) => {
  const { email, password } = credentials; // { csrfToken, email, password } = credentials

  if (!email || !password) {
    return Promise.reject("Must provide a valid matching email and password");
  }

  console.log("----------GET USER----------");

  if (mongoose.connections[0].readyState !== 1) {
    await dbConnect();
  }

  let user = await TC(() => User.findOne({ email }).exec());

  if (!user) {
    console.log("----------REGISTERING USER----------");
    // 🚧  if user is not registered -- automatically signup user
    user = await TC(() => registerUser(email, password));
  }

  if (user && !user.password) {
    console.log("----------UPDATE PASSWORD----------");
    // if user exists but does not have a password add it.
    // 🚧 FIXME: need to hash before adding password, to ensure the update is valid
    user = await TC(() => updateUser(user.id, user.password));
  }

  console.log("----------AUTHORIZE----------");

  // // bcrypt.compare(password, user.password, (err ,result) => {
  // //  return  result  ? Promise.resolve(user) : Promise.reject(err)
  // //});
  let isValidPassword = true;
  if (!isValidPassword && password) {
    console.log("----------VALIDATE PASSWORD----------");
    // @TODO: Add validattion
    isValidPassword = await crossCheckPassword(password, user);

    if (!user.emailVerified) {
      // send user to different page to re-verify email
      return Promise.reject(
        "/auth/credentials-signin?error=Please verify your email"
      );
    }
  }

  if (user && isValidPassword) return Promise.resolve(user);
  return Promise.reject("/auth/credentials-signin?error=Invalid Password");
};
