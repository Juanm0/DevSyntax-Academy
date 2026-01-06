import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function DashboardProfesor() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) return;

      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher_id", user.id);

      setCourses(coursesData || []);
      setLoading(false);
    }

    load();
  }, []);

  async function selectCourse(course) {
    setSelectedCourse(course);

    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    setLessons(data || []);
  }

  async function createLesson(e) {
    e.preventDefault();

    if (!selectedCourse) return;

    await supabase.from("lessons").insert({
      course_id: selectedCourse.id,
      title,
      video_url: videoUrl,
      order_index: Number(orderIndex),
    });

    setTitle("");
    setVideoUrl("");
    setOrderIndex("");

    selectCourse(selectedCourse);
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Cargando dashboard...</p>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
      <h1>Dashboard del profesor</h1>

      {/* SIN CURSOS */}
      {courses.length === 0 && (
        <p>No estás dictando ningún curso actualmente.</p>
      )}

      {/* LISTA DE CURSOS */}
      {courses.length > 0 && (
        <section>
          <h2>Mis cursos</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.id} style={{ marginBottom: "0.5rem" }}>
                <button onClick={() => selectCourse(course)}>
                  Ver clases
                </button>{" "}
                {course.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CLASES */}
      {selectedCourse && (
        <section style={{ marginTop: "3rem" }}>
          <h2>Clases – {selectedCourse.title}</h2>

          {lessons.length === 0 && (
            <p>Este curso todavía no tiene clases.</p>
          )}

          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                #{lesson.order_index} – {lesson.title}
                {lesson.video_url && (
                  <>
                    {" "}
                    –{" "}
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver video
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>

          <hr />

          {/* CREAR CLASE */}
          <form onSubmit={createLesson} style={{ marginTop: "1.5rem" }}>
            <h3>Agregar nueva clase</h3>

            <input
              placeholder="Título de la clase"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              placeholder="URL del video (Zoom, Drive, YouTube, etc)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />

            <input
              placeholder="Orden (1, 2, 3...)"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(e.target.value)}
              required
            />

            <button type="submit">Crear clase</button>
          </form>
        </section>
      )}
    </div>
  );
}
