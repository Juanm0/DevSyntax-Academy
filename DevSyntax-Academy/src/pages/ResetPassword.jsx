import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { updatePassword } from "../services/auth.service";
import { supabase } from "../services/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    async function verifyRecoveryLink() {
      // Supabase puede mandar el link de dos formas distintas:
      // 1) con un "code" en la URL (?code=...) -> hay que canjearlo por sesión
      // 2) con tokens directo en el hash (#access_token=...&type=recovery) -> supabase-js ya los toma solo

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError("Este link de recuperación no es válido o ya expiró.");
          setCheckingLink(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setError(
          "Este link no es válido o ya expiró. Pedí uno nuevo desde “¿Olvidaste tu contraseña?”."
        );
        setValidLink(false);
      } else {
        setValidLink(true);
      }

      setCheckingLink(false);
    }

    verifyRecoveryLink();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingLink) {
    return (
      <AuthCard title="Elegir nueva contraseña">
        <p style={{ opacity: 0.7 }}>Verificando el link...</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Elegir nueva contraseña">
      {success ? (
        <p style={{ color: "#4ade80" }}>
          Contraseña actualizada. Te llevamos al login...
        </p>
      ) : !validLink ? (
        <p style={{ color: "tomato" }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "tomato" }}>{error}</p>}

          <Button disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
