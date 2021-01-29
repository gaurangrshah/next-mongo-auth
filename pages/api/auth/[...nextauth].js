import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import mongoose from "mongoose";

import { validateCredentials, registerUser } from "@/utils/auth";
// import TC from "@/utils/trycatch";
import Models from "@/models";
import dbConnect from "@/utils/mongoose";
import jwt from "jsonwebtoken";

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
        if (mongoose.connections[0].readyState !== 1) {
          await dbConnect();
          console.log("------DB CONNECT-----");
        }

        try {
          const { email, password } = credentials;
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
        } catch (e) {
          console.log(e);
        }
        /**
         * @param   {object}      credentials       { csrfToken, email, password } = credentials
         * @returns {user || redirect}
         */
      },
    })
  );
}

const callbacks = {};

// @link: https://tinyurl.com/y6jltvz8
callbacks.signIn = async function signIn(user, account, profile) {
  console.log("-----SIGNIN CHECK-----");
  // oauth providers are preconfigured, we don't have to manually do any authentication
  if (account.type === "oauth" || account.type === "email") {
    return Promise.resolve("/secret"); // ↩️
  }
  let isAllowedToLogin;
  // allows/disallows login - based on a valid dbUser
  isAllowedToLogin = await validateCredentials(profile).catch((e) =>
    console.log(e)
  );

  if (isAllowedToLogin) {
    console.log("-----------USER IS BEING LOGGED IN--------");
    return Promise.resolve("/secret"); // ↩️
  }
  console.log("-----------USER IS NOT ALLOWED TO LOGIN--------");
  return Promise.resolve("auth/error?error=AccessDenied"); // ↩️
  // return Promise.resolve(false); // ↩️ using false sends to access denied page

  /**
   * @param  {object} user     User object
   * @param  {object} account  Provider account
   * @param  {object} profile  Provider profile
   * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
   *                           Return `false` to deny access
   */
};

// @link used for jwt & session: https://tinyurl.com/y3ypltj2
callbacks.jwt = async (token, user, account, profile, isNewUser) => {
  //   if (user) token = { id: user.id };
  //   return token;
  console.log("---JWT CHECK---");
  const isSignIn = !!user;
  if (isSignIn) {
    console.log("-----GENERATE JWT-----");
    token.auth_time = Number(new Date());
    token.id = user.id;
    console.log("-----JWT GENERATED-----");
  }
  return Promise.resolve(token);

  /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  user      User object      (only available on sign in)
   * @param  {object}  account   Provider account (only available on sign in)
   * @param  {object}  profile   Provider profile (only available on sign in)
   * @param  {boolean} isNewUser True if new user (only available on sign in)
   * @return {object}            JSON Web Token that will be saved
   */
};

callbacks.session = async function session(...args) {
  //   session.accessToken = token.accessToken;
  ///  return session;
  const [session, user] = args;

  const { id } = session;
  if (mongoose.connections[0].readyState !== 1) {
    await dbConnect();
    console.log("------DB CONNECT-----");
  }
  const dbUser = Models.User.findById(id)
    .exec()
    .catch((e) => console.log("session => err!", e));
  //@TODO: add encoded token to session if needed

  session.name = user.name;

  return Promise.resolve(session);

  /**
   * @param  {object} session      Session object
   * @param  {object} user         User object    (if using database sessions)
   *                               JSON Web Token (if not using database sessions)
   * @return {object}              Session that will be returned to the client
   */
};

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
    // custom methods allow overriding of default token encode/decode methods
    encode: async ({ token, secret }) => await jwt.sign(token, secret),
    decode: async ({ token, secret }) => await jwt.verify(token, secret),
  },
  callbacks,
  database: {
    type: "mongodb",
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    url: `${process.env.MONGODB_URL}/next-studio`,
    customModels: {
      User: Models.User,
      Account: Models.Account,
      Session: Models.Session,
      Asset: Models.Asset,
      Block: Models.Block,
      Page: Models.Page,
      Section: Models.Section,
      // VerificationRequest: Models.VerificationRequest,
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Enable debug messages in the console if you are having problems
  // debug: true,
};

export default (req, res) => NextAuth(req, res, options);
