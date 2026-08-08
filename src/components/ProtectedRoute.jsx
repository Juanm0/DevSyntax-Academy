import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Protege una ruta según sesión y, opcionalmente, rol.
 *
 * - Sin sesión → redirige a /login
 * - Con sesión pero rol no permitido → redirige a /
 * - allowedRoles=null (default) → solo exige estar logueado, cualquier rol pasa
 *
 * Ejemplo: <ProtectedRoute allowedRoles={["admin"]}>...</ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = profile?.role?.trim().toLowerCase();

  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
