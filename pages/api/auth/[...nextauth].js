import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwt from "jsonwebtoken";

import {
  credentialsProvider,
  emailProvider,
  githubProvider,
} from "@/config/next-auth/providers";
import { callbacks } from "@/config/next-auth/callbacks";
import { mongoConfig } from "@/config/next-auth/mongo";

const providers = [Providers.Email(emailProvider)];

if (process.env.GITHUB_CLIENT_ID) {
  // save user with github credentials
  providers.push(Providers.GitHub(githubProvider));
} else {
  // save user with local credentials
  providers.push(Providers.Credentials(credentialsProvider));
}

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
  database: mongoConfig,
  pages: {
    signIn: "/auth/signin",
  },
  // Enable debug messages in the console if you are having problems
  // debug: true,
};

export default (req, res) => NextAuth(req, res, options);
