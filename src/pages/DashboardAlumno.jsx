import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

export default function DashboardAlumno() {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      /* 1️⃣ Cursos inscriptos */
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
          courses (
            id,
            title,
            description,
            cover_image
          )
        `)
        .eq("user_id", user.id);

      const userCourses = enrollments?.map((e) => e.courses) || [];
      setCourses(userCourses);

      /* 2️⃣ Lecciones */
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, course_id");

      /* 3️⃣ Progreso */
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      /* 4️⃣ Calcular progreso */
      const map = {};

      userCourses.forEach((course) => {
        const courseLessons = lessons?.filter(
          (l) => l.course_id === course.id
        ) || [];

        const completedLessons = progress?.filter((p) =>
          courseLessons.some((l) => l.id === p.lesson_id)
        ) || [];

        const total = courseLessons.length;
        const completed = completedLessons.length;

        map[course.id] = {
          total,
          completed,
          percent: total ? Math.round((completed / total) * 100) : 0,
        };
      });

      setProgressMap(map);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p>Cargando tus cursos...</p>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <h1>Mis cursos</h1>

      {courses.length === 0 && (
        <p>No estás haciendo ningún curso actualmente.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {courses.map((course) => {
          const progress = progressMap[course.id];

          return (
            <div
              key={course.id}
              style={{
                background: "rgba(15,23,42,0.7)",
                borderRadius: 18,
                padding: "1.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {course.cover_image && (
                <div
                  style={{
                    height: 140,
                    borderRadius: 12,
                    backgroundImage: `url(${course.cover_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "1rem",
                  }}
                />
              )}

              <h3>{course.title}</h3>
              <p style={{ opacity: 0.85 }}>
                {course.description?.slice(0, 90)}...
              </p>

              {/* PROGRESO */}
              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress?.percent || 0}%`,
                      height: "100%",
                      background: "#4ade80",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                <small style={{ opacity: 0.8 }}>
                  {progress?.completed || 0} / {progress?.total || 0} clases ·{" "}
                  {progress?.percent || 0}%
                </small>
              </div>

              <Link to={`/course/${course.id}`}>
                <button style={{ marginTop: "1rem" }}>
                  Continuar curso
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
