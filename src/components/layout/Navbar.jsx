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


/* import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>DevSyntax</Link>

      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    background: "#0f172a",
    color: "white",
  },
  logo: {
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
}; */
