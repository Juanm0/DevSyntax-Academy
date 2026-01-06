import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function CourseLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessons, setLessons] = useState([]);

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data } = await supabase.from("courses").select("id, title");
    setCourses(data || []);
  }

  async function loadLessons(courseId) {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    setLessons(data || []);
  }

  async function handleCourseChange(e) {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    loadLessons(courseId);
  }

  async function createLesson(e) {
    e.preventDefault();
    if (!selectedCourse) return;

    setLoading(true);

    await supabase.from("lessons").insert({
      course_id: selectedCourse,
      title,
      video_url: videoUrl,
      order_index: order,
    });

    setTitle("");
    setVideoUrl("");
    setOrder(order + 1);

    loadLessons(selectedCourse);
    setLoading(false);
  }

  async function deleteLesson(id) {
    await supabase.from("lessons").delete().eq("id", id);
    loadLessons(selectedCourse);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Administrar clases</h1>

      {/* SELECT CURSO */}
      <select value={selectedCourse} onChange={handleCourseChange}>
        <option value="">Seleccionar curso</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      {selectedCourse && (
        <>
          {/* FORM */}
          <form onSubmit={createLesson} style={{ marginTop: "2rem" }}>
            <h3>Nueva clase</h3>

            <input
              placeholder="Título de la clase"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              placeholder="Link del video (Zoom / Meet / Drive)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />

            <input
              type="number"
              placeholder="Orden"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />

            <button disabled={loading}>
              {loading ? "Creando..." : "Agregar clase"}
            </button>
          </form>

          {/* LISTADO */}
          <h3 style={{ marginTop: "2rem" }}>Clases</h3>

          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id} style={{ marginBottom: "0.5rem" }}>
                {lesson.order_index}. {lesson.title}
                <button
                  onClick={() => deleteLesson(lesson.id)}
                  style={{ marginLeft: "1rem" }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
