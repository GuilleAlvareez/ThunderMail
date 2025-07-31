import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { AccountLogo } from "./AccountLogo";
import { LoginButton } from "./LoginButton";
import { LoadingAccount } from "../Loaders/loadingAccount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "../../types/interfaces";

interface HeaderProps {
  onStyleChange: (style: string) => void;
}

export function Header({ onStyleChange }: HeaderProps) {
  const { user, loading, handleLogin, handleLogout } = useAuth();
  const [selectedStyle, setSelectedStyle] = useState("formal");

  function handleStyleChange(value: string) {
    // Crear los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    params.set("style", value); // Usar set en lugar de append para evitar duplicados

    // Actualizar la URL sin recargar la página
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newURL);

    setSelectedStyle(value);
    onStyleChange(value);
  }

  useEffect(() => {
    // Obtener el parámetro "style" de la URL
    const params = new URLSearchParams(window.location.search);
    const style = params.get("style") || "formal";
    setSelectedStyle(style);
  }, []) 

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
    <div className="flex justify-between mb-4">
      <Select value={selectedStyle} onValueChange={handleStyleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="formal">Formal</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="informal">Informal</SelectItem>
          <SelectItem value="funny">Funny</SelectItem>
        </SelectContent>
      </Select>
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
