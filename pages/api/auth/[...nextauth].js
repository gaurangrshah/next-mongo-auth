import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import mongoose from "mongoose";

import { authorizeUserBasedOnStatus, registerUser } from "@/utils/auth";
import TC from "@/utils/trycatch";
import Models from "@/models";
import dbConnect from "@/utils/mongoose";

const providers = [
  Providers.Email({
    server: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_FROM, // The "from" address that you want to use
  }),
];

if (process.env.GITHUB_CLIENT_ID) {
  // save user with github credentials
  providers.push(
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
} else {
  providers.push(
    // save user with local credentials
    Providers.Credentials({
      name: "local",

      async authorize(credentials) {
        console.log("------Credentials Authorize------");
        const { email, password } = credentials;

        if (mongoose.connections[0].readyState !== 1) {
          await dbConnect();
          console.log("------DB CONNECT-----");
        }
        let user = await Models.User.findByEmail(email);
        if (user) {
          console.log("authorize: returning found user");
          return Promise.resolve(user);
        }
        return (
          !user &&
          Promise.reject(
            "/auth/credentials-signin?error=User could not be authorized"
          )
        );
      },
    })
  );
}

const callbacks = {};

callbacks.signIn = async function signIn(user, account, profile) {
  console.log(
    "🚀 ~ file: [...nextauth].js ~ line 73 ~ signIn ~ user, account, profile",
    user,
    account,
    profile
  );
  /**
   * @param  {object} user     User object
   * @param  {object} account  Provider account
   * @param  {object} profile  Provider profile
   * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
   *                           Return `false` to deny access
   */

  console.log("-----SIGNIN CHECK-----");

  // oauth providers are preconfigured, we don't have to manually do any authentication
  if (account.type === "oauth" || account.type === "email") return true; // ↩️

  let isEmailVerified = false; // checks if user's email has been verified
  let dbUser = undefined; // matching database user to users signing in.
  let isAllowedToLogin = false; // allows/disallows login - based on a valid dbUser

  // FIXME: when user passwords should be validated should be
  dbUser = await Models.User.findByEmail(user.email);
  console.log(
    "🚀 ~ file: [...nextauth].js ~ line 81 ~ signIn ~ dbUser",
    dbUser
  );

  if (!dbUser) console.log("----USER NOT FOUND2----");

  console.log("-----validating passwords-----");

  // @TODO: Add a check for verified once we get verification extended

  // isEmailVerified = !!dbUser?.emailVerified;
  // if (!isEmailVerified) console.log("----EMAIL NOT VERIFIED----");

  isAllowedToLogin = dbUser.validPassword(user.password);

  if (isAllowedToLogin) {
    console.log("-----------USER IS BEING LOGGED IN--------");
    return Promise.resolve("/secret"); // ↩️
  }
  console.log("-----------USER IS NOT ALLOWED TO LOGIN--------");
  return Promise.resolve(false); // ↩️
};

// @link used for jwt & session: https://tinyurl.com/y3ypltj2
callbacks.jwt = async (token, user, account, profile, isNewUser) => {
  /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  user      User object      (only available on sign in)
   * @param  {object}  account   Provider account (only available on sign in)
   * @param  {object}  profile   Provider profile (only available on sign in)
   * @param  {boolean} isNewUser True if new user (only available on sign in)
   * @return {object}            JSON Web Token that will be saved
   */
  //   if (user) token = { id: user.id };
  //   return token;

  console.log("-----JWT CHECK-----");
  const isSignIn = !!user;
  if (isSignIn) {
    token.auth_time = Number(new Date());
    token.id = user.id;
    console.log("-----token updated-----");
  }
  return Promise.resolve(token);
};

// callbacks.session = async function session(session, token) {
//   /**
//    * @param  {object} session      Session object
//    * @param  {object} user         User object    (if using database sessions)
//    *                               JSON Web Token (if not using database sessions)
//    * @return {object}              Session that will be returned to the client
//    */
//   //   session.accessToken = token.accessToken;
//   ///  return session;
//   const { id } = sessionToken;
//   const url = `${process.env.SITE}/api/user/${id}`;
//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   if (res.status === 200) {
//     const user = await res.json();
//     session.user.name = user.name;
//   } else {
//     return Promise.reject();
//   }
//   return Promise.resolve(session);
// };

const options = {
  providers,
  session: {
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    // signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    secret: process.env.JWT_SECRET || "this-should-be-a-secret",
  },
  callbacks,
  database: {
    type: "mongodb",
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    url: `${process.env.MONGODB_URL}/task-manager-api`,
    customModels: {
      User: Models.User,
      Task: Models.Task,
      Account: Models.Account,
      Session: Models.Session,
      // VerificationRequest: Models.VerificationRequest,
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
