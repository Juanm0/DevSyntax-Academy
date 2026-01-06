/* 
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./course.css";

export default function Course() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      // Usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      // Curso
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (!courseError) {
        setCourse(courseData);
      }

      // Lessons del curso
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index", { ascending: true });

      setLessons(lessonsData || []);

      // Ver si el usuario está inscripto
      if (user) {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("user_id")
          .eq("course_id", id)
          .eq("user_id", user.id)
          .single();

        setEnrolled(!!enrollment);
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
      { }
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
            {enrolled ? "Ir al curso" : "Comprar curso"}
          </button>
        </div>
      </section>

      {}
      <aside className="course-sidebar">
        <div className="course-sidebar-card">
          <h3>Este curso incluye</h3>

          <ul>
            <li>📚 Nivel: {course.level || "No especificado"}</li>
            <li>⏱ Duración: {course.duration || "Próximamente"}</li>
            <li>🌎 Idioma: {course.language || "Español"}</li>
          </ul>

          <button className="course-cta full">
            {enrolled ? "Continuar curso" : "Empezar ahora"}
          </button>
        </div>
      </aside>

      {}
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

        {course.stack?.length > 0 && (
          <>
            <h2>Tecnologías utilizadas</h2>
            <ul className="course-list">
              {course.stack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </>
        )}

        {}
        <h2>Contenido del curso</h2>

        <ul className="course-lessons">
          {lessons.length === 0 && (
            <p>El contenido se publicará próximamente</p>
          )}

          {lessons.map((lesson, index) => (
            <li key={lesson.id} className="lesson-item">
              <span>
                {index + 1}. {lesson.title}
              </span>

              {enrolled ? (
                <a
                  href={lesson.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶️ Ver clase
                </a>
              ) : (
                <span className="lesson-locked">🔒 Bloqueado</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
   


 */

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./course.css";
import { enrollInCourse } from "../services/enrollment.service";

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function handleEnroll() {
    try {
      if (!user) {
        navigate("/login", {
          state: { redirectTo: `/course/${id}` },
        });
        return;
      }

      await enrollInCourse(id);
      setIsEnrolled(true);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function loadCourse() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      /* CURSO */
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      setCourse(courseData);

      /* LECCIONES */
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index", { ascending: true });

      setLessons(lessonsData || []);

      if (user) {
        /* INSCRIPCIÓN */
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("*")
          .eq("course_id", id)
          .eq("user_id", user.id)
          .single();

        setIsEnrolled(!!enrollment);

        /* PROGRESO */
        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", user.id);

        const map = {};
        progressData?.forEach((p) => {
          map[p.lesson_id] = p.completed;
        });

        setProgress(map);
      }

      setLoading(false);
    }

    loadCourse();
  }, [id]);

  async function markCompleted(lessonId) {
    if (!user) return;

    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date(),
    });

    setProgress((prev) => ({
      ...prev,
      [lessonId]: true,
    }));
  }

  if (loading) return <p className="course-loading">Cargando curso...</p>;
  if (!course) return <p>Curso no encontrado</p>;

  return (
    <main className="course-page">
      {/* HERO */}
      <section className="course-hero">
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        {!isEnrolled && (
          <button className="course-cta" onClick={handleEnroll}>
            Comprar curso
          </button>
        )}

        {isEnrolled && (
          <p style={{ color: "#4ade80", marginTop: "1rem" }}>
            Ya estás inscripto en este curso
          </p>
        )}
      </section>

      {/* CONTENIDO */}
      <section className="course-content">
        <h2>Clases del curso</h2>

        {!isEnrolled && (
          <p>
            Estás viendo un preview. Comprá el curso para acceder al contenido
            completo.
          </p>
        )}

        <ul className="course-list">
          {lessons.map((lesson, index) => {
            const completed = progress[lesson.id];

            return (
              <li
                key={lesson.id}
                style={{
                  opacity: !isEnrolled ? 0.6 : 1,
                }}
              >
                <strong>
                  {index + 1}. {lesson.title}
                </strong>

                {isEnrolled ? (
                  <>
                    {lesson.video_url && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <a
                          href={lesson.video_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver clase
                        </a>
                      </div>
                    )}

                    {!completed ? (
                      <button
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => markCompleted(lesson.id)}
                      >
                        Marcar como completada
                      </button>
                    ) : (
                      <span style={{ color: "#4ade80" }}>
                        ✔ Clase completada
                      </span>
                    )}
                  </>
                ) : (
                  <p>Disponible al comprar el curso</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
