import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AuthCard title="Iniciar sesión">
      <form>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="********"
        />

        <Button>Entrar</Button>
      </form>

      <p className="auth-link">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </AuthCard>
  );
}
