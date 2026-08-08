import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { signUp } from "../services/auth.service";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signUp(email, password, fullName);

      // Si Supabase tiene la confirmación de email activada, signUp no
      // devuelve una sesión activa: hay que avisarle al usuario que revise
      // su correo en vez de asumir que ya quedó logueado.
      if (!data.session) {
        setNeedsConfirmation(true);
        return;
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (needsConfirmation) {
    return (
      <AuthCard title="Confirmá tu cuenta">
        <p style={{ color: "#4ade80" }}>
          Te enviamos un mail a <strong>{email}</strong> para confirmar tu
          cuenta. Revisá también la carpeta de spam antes de iniciar sesión.
        </p>
        <p className="auth-link">
          <Link to="/login">Ir a iniciar sesión</Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Crear cuenta">
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "tomato" }}>{error}</p>}

        <Button>Registrarme</Button>
      </form>

      <p className="auth-link">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </AuthCard>
  );
}
