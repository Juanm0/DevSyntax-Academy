/* import { Link } from "react-router-dom";
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
 */


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role || null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function getDashboardLink() {
    if (role === "admin") {
      return { label: "Dashboard", to: "/dashboard" };
    }
    if (role === "student") {
      return { label: "Mis cursos", to: "/dashboard-alumno" };
    }
    if (role === "teacher") {
      return { label: "Mis cursos", to: "/dashboard-profesor" };
    }
    return null;
  }

  const dashboardLink = getDashboardLink();

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="logo brand">
          <img
            src="https://i.ibb.co/NgshnRMM/imagen-circular-recortada.png"
            alt="DevSyntax logo"
            className="brand-icon"
          />

          <span className="brand-text">
            DevSyntax{" "}
            <span className="academy">
              Academy
            </span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>

          {user && dashboardLink && (
            <Link to={dashboardLink.to}>
              {dashboardLink.label}
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="cta">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
