import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { validateCredentials, registerUser } from "@/utils/auth";
import Models from "@/models";
import dbConnect from "@/utils/mongoose";


export const emailProvider = {
  server: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  from: process.env.SMTP_FROM, // The "from" address that you want to use
};

export const githubProvider = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
};

export const credentialsProvider = {
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
};


