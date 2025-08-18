import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // Le decimos al cliente que nuestro backend está en localhost:6543
  // baseURL: import.meta.env.VITE_URL_BACKEND,
  baseURL: "http://localhost:6543",
});