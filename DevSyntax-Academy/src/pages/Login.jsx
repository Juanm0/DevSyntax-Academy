import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { signIn } from "../services/auth.service";
import { supabase } from "../services/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { user } = await signIn(email, password);

      // Si viene desde comprar curso, respetamos el redirect
      if (redirectTo) {
        navigate(redirectTo);
        return;
      }

      // Si no, redirigimos según rol
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role === "admin") {
        navigate("/dashboard");
      } else if (profile.role === "teacher") {
        navigate("/dashboard-profesor");
      } else {
        navigate("/dashboard-alumno");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard title="Iniciar sesión">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="auth-link" style={{ textAlign: "right", marginTop: "-0.5rem" }}>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>

        {error && <p style={{ color: "tomato" }}>{error}</p>}

        <Button>Entrar</Button>
      </form>

      <p className="auth-link">
        ¿No tenés cuenta?{" "}
        <Link to="/register" state={{ redirectTo }}>
          Registrate
        </Link>
      </p>
    </AuthCard>
  );
}
