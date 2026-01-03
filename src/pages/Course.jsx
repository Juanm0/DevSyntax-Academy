/* import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import './Course.css'

export default function Course() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Curso no encontrado");
      } else {
        setCourse(data);
      }

      setLoading(false);
    }

    fetchCourse();
  }, [id]);

  if (loading) return <p>Cargando curso...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="course-page">
      <img
        src={course.thumbnail_url}
        alt={course.title}
        className="course-hero"
      />

      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <strong className="price">$35.000</strong>
    </div>
  );
}
 */

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./course.css";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setCourse(data);
      }

      setLoading(false);
    }

    loadCourse();
  }, [id]);

  if (loading) {
    return <p className="course-loading">Cargando curso...</p>;
  }

  if (!course) {
    return <p className="course-loading">Curso no encontrado</p>;
  }

  return (
    <main className="course-page">
      {/* HERO */}
      <section
        className="course-hero"
        style={{
          backgroundImage: course.cover_image
            ? `url(${course.cover_image})`
            : undefined,
        }}
      >
        <div className="course-hero-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          <button className="course-cta">
            Empezar curso
          </button>
        </div>
      </section>

      {/* SIDEBAR */}
      <aside className="course-sidebar">
        <div className="course-sidebar-card">
          <h3>Este curso incluye</h3>

          <ul>
            <li>📚 Nivel: {course.level || "No especificado"}</li>
            <li>⏱ Duración: {course.duration || "Próximamente"}</li>
            <li>🌎 Idioma: {course.language || "Español"}</li>
          </ul>

          <button className="course-cta full">
            Empezar ahora
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <section className="course-content">
        <h2>Qué vas a aprender</h2>

        {course.what_you_will_learn?.length ? (
          <ul className="course-list">
            {course.what_you_will_learn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No especificado</p>
        )}

        <h2>Requisitos</h2>

        {course.requirements?.length ? (
          <ul className="course-list">
            {course.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        ) : (
          <p>No tiene requisitos</p>
        )}

        {course.stack?.length && (
          <>
            <h2>Tecnologías utilizadas</h2>

            <ul className="course-list">
              {course.stack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

