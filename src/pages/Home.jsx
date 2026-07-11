import { useEffect, useState } from "react";
import { getPublishedCourses } from "../services/course.service";
import CourseCard from "../components/course/CourseCard";
import "./Home.css";


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
        console.error(err);
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
    <div className="home-glass">
      <h1 className="home-title">Todos los cursos</h1>

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
  </div>
);

}
