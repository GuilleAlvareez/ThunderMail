import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { AccountLogo } from "./AccountLogo";
import { LoginButton } from "./LoginButton";
import { LoadingAccount } from "../Loaders/loadingAccount";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import type { User } from "../../types/interfaces";

interface HeaderProps {
  onStyleChange: (style: string) => void;
}

export function Header({ onStyleChange }: HeaderProps) {
  const { user, loading, handleLogin, handleLogout } = useAuth();
  

  function loginWithGoogle() {
    handleLogin();
  }

  async function logoutSession() {
    try {
      await handleLogout();
      console.log("Logout exitoso. Redirigiendo...");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-end">
        <LoadingAccount />
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      {user ? (
        <div>
          <AccountLogo user={user as User} logoutFunction={logoutSession} />
        </div>
      ) : (
        <LoginButton loginFunction={loginWithGoogle} />
      )}
    </div>
  );
}
