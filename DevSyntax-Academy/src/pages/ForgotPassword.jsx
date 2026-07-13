import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { sendPasswordResetEmail } from "../services/auth.service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Recuperar contraseña">
      {sent ? (
        <p style={{ color: "#4ade80" }}>
          Listo, te enviamos un mail a <strong>{email}</strong> con un link
          para elegir una contraseña nueva. Revisá también la carpeta de spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
            Ingresá tu email y te mandamos un link para crear una contraseña
            nueva.
          </p>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p style={{ color: "tomato" }}>{error}</p>}

          <Button disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}

      <p className="auth-link">
        <Link to="/login">← Volver a iniciar sesión</Link>
      </p>
    </AuthCard>
  );
}
