/* import "./Home.css";

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
 */

import { useEffect, useState } from "react";
import { getPublishedCourses } from "../services/course.service";
import CourseCard from "../components/course/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getPublishedCourses();
        setCourses(data);
      } catch (err) {
        setError("No se pudieron cargar los cursos");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) return <p>Cargando cursos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home">
      <h1>Todos los cursos</h1>

      {courses.length === 0 ? (
        <p>No hay cursos disponibles</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
