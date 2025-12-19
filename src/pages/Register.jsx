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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp(email, password, fullName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

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
