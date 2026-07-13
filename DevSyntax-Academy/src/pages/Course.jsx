import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./Course.css";
import { enrollInCourse } from "../services/enrollment.service";

function formatPrice(price) {
  if (price === null || price === undefined) return "Consultar precio";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
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

      /* DOCENTE */
      const teacherId = courseData?.teacher_id || courseData?.instructor_id;
      if (teacherId) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url, bio")
          .eq("id", teacherId)
          .single();

        setInstructor(profileData || null);
      }

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

  const completedCount = lessons.filter((l) => progress[l.id]).length;

  return (
    <main className="course-page">
      {/* BREADCRUMB */}
      <nav className="course-breadcrumb">
        <Link to="/">Inicio</Link>
        <span> / </span>
        <span className="current">{course.title}</span>
      </nav>

      {/* HERO */}
      <section
        className="course-hero"
        style={{
          backgroundImage: course.cover_image
            ? `linear-gradient(135deg, rgba(2,6,23,0.6), rgba(2,6,23,0.75)), url(${course.cover_image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {(course.level || course.duration) && (
          <div className="hero-badges">
            {course.level && <span className="badge">{course.level}</span>}
            {course.duration && <span className="badge">⏱ {course.duration}</span>}
          </div>
        )}

        <h1>{course.title}</h1>

        {instructor?.full_name && (
          <p className="hero-instructor">
            Un curso de <strong>{instructor.full_name}</strong>
          </p>
        )}

        {!isEnrolled ? (
          <button className="course-cta hero-cta" onClick={handleEnroll}>
            ▶ Empezar curso
          </button>
        ) : (
          <a href="#clases-del-curso" className="course-cta hero-cta">
            ▶ Continuar curso
          </a>
        )}
      </section>

      {/* CUERPO PRINCIPAL */}
      <div className="course-body">
        <p className="course-description">{course.description}</p>

        {course.stack?.length > 0 && (
          <div className="stack-chips" style={{ marginBottom: "1.5rem" }}>
            {course.stack.map((tech) => (
              <span className="chip" key={tech}>{tech}</span>
            ))}
          </div>
        )}

        {/* QUÉ VAS A APRENDER */}
        {course.what_you_will_learn?.length > 0 && (
          <section className="course-content">
            <h2>Lo que aprenderás</h2>
            <div className="learn-grid">
              {course.what_you_will_learn.map((item, index) => (
                <div className="learn-item" key={index}>
                  <span className="learn-num">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REQUISITOS */}
        {course.requirements?.length > 0 && (
          <section className="course-content">
            <h2>Requisitos</h2>
            <ul className="course-list">
              {course.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* CONTENIDO / CLASES */}
        <section className="course-content" id="clases-del-curso">
          <h2>Contenido del curso</h2>
          <p className="content-summary">
            {lessons.length} {lessons.length === 1 ? "clase" : "clases"}
            {isEnrolled && lessons.length > 0 && (
              <> · {completedCount} de {lessons.length} completadas</>
            )}
          </p>

          {!isEnrolled && (
            <p className="preview-notice">
              Estás viendo un preview. Comprá el curso para acceder al contenido completo.
            </p>
          )}

          {lessons.length === 0 && (
            <p style={{ opacity: 0.7 }}>El contenido se publicará próximamente.</p>
          )}

          <ul className="lesson-list">
            {lessons.map((lesson, index) => {
              const completed = progress[lesson.id];

              return (
                <li key={lesson.id} className={`lesson-row ${!isEnrolled ? "locked" : ""}`}>
                  <span className="lesson-status">
                    {isEnrolled ? (completed ? "✅" : "⭕") : "🔒"}
                  </span>

                  <span className="lesson-title">
                    {index + 1}. {lesson.title}
                  </span>

                  <span className="lesson-action">
                    {isEnrolled ? (
                      <>
                        {lesson.video_url && (
                          <a href={lesson.video_url} target="_blank" rel="noreferrer">
                            Ver clase
                          </a>
                        )}
                        {!completed && (
                          <button onClick={() => markCompleted(lesson.id)}>
                            Marcar como completada
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="lesson-locked-text">Bloqueada</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="course-back-link">
          <Link to="/">← Volver a todos los cursos</Link>
        </p>
      </div>

      {/* SIDEBAR */}
      <aside className="course-sidebar">
        <div className="course-sidebar-card">
          <h3>Este curso incluye</h3>

          <ul>
            <li>📚 Nivel: {course.level || "No especificado"}</li>
            <li>⏱ Duración: {course.duration || "Próximamente"}</li>
            <li>🌎 Idioma: {course.language || "Español"}</li>
            <li>🎬 Clases: {lessons.length || "A confirmar"}</li>
          </ul>

          {!isEnrolled ? (
            <button className="course-cta full" onClick={handleEnroll}>
              {formatPrice(course.price)} — Comprar
            </button>
          ) : (
            <a href="#clases-del-curso" className="course-cta full">
              Ir a las clases
            </a>
          )}

          <p className="access-note">Acceso de por vida a este curso</p>
        </div>

        {course.stack?.length > 0 && (
          <div className="course-sidebar-card">
            <h3>Stack</h3>
            <div className="stack-chips">
              {course.stack.map((tech) => (
                <span className="chip" key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        )}

        {instructor && (
          <div className="course-sidebar-card">
            <h3>Docente</h3>
            <div className="instructor-row">
              {instructor.avatar_url && (
                <img src={instructor.avatar_url} alt={instructor.full_name} className="instructor-avatar" />
              )}
              <div>
                <strong>{instructor.full_name || "Docente"}</strong>
                <p className="instructor-role">
                  {instructor.role === "teacher" ? "Profesor" : instructor.role}
                </p>
              </div>
            </div>
            {instructor.bio && <p className="instructor-bio">{instructor.bio}</p>}
          </div>
        )}
      </aside>
    </main>
  );
}
