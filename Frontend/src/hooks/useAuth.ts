import { authService } from "../services/AuthServise";
import { useEffect, useState } from "react";
import type { User } from "../types/interfaces";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    try {
      await authService.login();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const userSession = await authService.userInfo();
      setUser(userSession?.data?.user || null);
    } catch (error) {
      console.error("Error obteniendo info de usuario:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getUserInfo();
  }, []);

  return { user, loading, handleLogin, handleLogout };
};
