import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="logo">DevSyntax</h1>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="cta">
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}
