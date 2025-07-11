import { authService } from "../services/AuthServise";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      await authService.login();
    } catch (error) {
      console.log(error);
      setError(true);
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
      setError(true);
    }
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const userSession = await authService.userInfo();
      setUser(userSession?.data?.user || null);
    } catch (error) {
      console.error("Error obteniendo info de usuario:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getUserInfo();
  }, []);

  return { user, loading, error, handleLogin, handleLogout };
};
