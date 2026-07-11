import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { updatePassword } from "../services/auth.service";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <AuthCard title="Elegir nueva contraseña">
      {success ? (
        <p style={{ color: "#4ade80" }}>
          Contraseña actualizada. Te llevamos al login...
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Contraseña nueva"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirmar contraseña"
            type="password"
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
