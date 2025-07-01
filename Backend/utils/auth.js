import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  database: new Pool({
    connectionString: `postgresql://postgres:${process.env.PASSWORD_DB}@db.sbxqhdwyblllxrwdhcdz.supabase.co:5432/postgres`,
  }),
});