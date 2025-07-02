import { authClient } from '../utils/auth-client';

export const authService = {
  login: () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:5173',
    });
  },

  logout: async () => {
    return await authClient.signOut();
  },

  userInfo: async () => {
    return authClient.getSession();
  },
};

