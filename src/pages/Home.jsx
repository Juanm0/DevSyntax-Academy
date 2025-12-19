import "./Home.css";

export default function Home() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>
          Aprendé desarrollo <span>en serio</span>
        </h1>
        <p>
          Cursos prácticos de programación y tecnología, pensados para el
          mundo real.
        </p>

        <div className="hero-actions">
          <a href="/register" className="primary-btn">
            Empezar ahora
          </a>
          <a href="/login" className="secondary-btn">
            Ya tengo cuenta
          </a>
        </div>
      </div>
    </section>
  );
}
