// utils/useGuardToken.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isTokenExpired } from "./jwt";           // tu helper que ya decodifica JWT

/**
 * Hook que devuelve una función guard().
 * Al llamar guard():
 *   • Si el token no existe o está vencido ⇒ muestra toast, hace logout, redirige a /admin y retorna true.
 *   • Si el token sigue válido ⇒ retorna false.
 *
 * Uso:
 *   const guard = useGuardToken();
 *   if (guard()) return;   // corta flujo si expiró
 */
export function useGuardToken() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    if (!token || isTokenExpired(token)) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
        toastId: "expired-session",
      });
      logout();                  // limpia estado global
      navigate("/admin");        // redirige
      return true;
    }
    return false;
  };
}
