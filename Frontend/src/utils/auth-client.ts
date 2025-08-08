import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // Le decimos al cliente que nuestro backend está en localhost:3000
  baseURL: import.meta.env.URL_BACKEND,
  // baseURL: "http://localhost:3000",
});