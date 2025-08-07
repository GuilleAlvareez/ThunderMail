import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // Le decimos al cliente que nuestro backend está en localhost:3000
  baseURL: "https://thundermail.onrender.com",
  // baseURL: "http://localhost:3000",
});