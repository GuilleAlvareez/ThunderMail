import { betterAuth } from "better-auth";
import { pool } from "./config.js";

export const auth = betterAuth({
  secret: process.env.SECRET,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
    },
  },
  trustedOrigins: ["http://localhost:5173"],
});
