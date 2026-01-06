import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  async function loadMyCourses() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // cursos donde está inscripto
    const { data: enrolledCourses } = await supabase
      .from("enrollments")
      .select("courses(*)")
      .eq("user_id", user.id);

    const coursesData = enrolledCourses?.map((e) => e.courses) || [];
    setCourses(coursesData);

    // cargar clases y progreso
    for (const course of coursesData) {
      await loadLessons(course.id, user.id);
    }

    setLoading(false);
  }

  async function loadLessons(courseId, userId) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");

    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId);

    setLessonsByCourse((prev) => ({
      ...prev,
      [courseId]: lessons || [],
    }));

    setProgress((prev) => ({
      ...prev,
      [courseId]: progressData || [],
    }));
  }

  async function toggleLesson(lessonId, completed) {
    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: !completed,
      completed_at: !completed ? new Date() : null,
    });

    loadMyCourses();
  }

  function calculateProgress(courseId) {
    const lessons = lessonsByCourse[courseId] || [];
    const completed = progress[courseId]?.filter((p) => p.completed).length || 0;

    if (!lessons.length) return 0;
    return Math.round((completed / lessons.length) * 100);
  }

  if (loading) {
    return <p>Cargando tus cursos...</p>;
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1>Mis cursos</h1>

      {courses.length === 0 && (
        <p>No estás inscripto en ningún curso todavía.</p>
      )}

      {courses.map((course) => (
        <section
          key={course.id}
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            borderRadius: 16,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h2>{course.title}</h2>

          <p>Progreso: {calculateProgress(course.id)}%</p>

          <progress
            value={calculateProgress(course.id)}
            max="100"
            style={{ width: "100%" }}
          />

          <ul style={{ marginTop: "1rem" }}>
            {lessonsByCourse[course.id]?.map((lesson) => {
              const completed = progress[course.id]?.find(
                (p) => p.lesson_id === lesson.id
              )?.completed;

              return (
                <li
                  key={lesson.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span>
                    {lesson.order_index}. {lesson.title}
                  </span>

                  <div>
                    {lesson.video_url && (
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: "1rem" }}
                      >
                        Ver clase
                      </a>
                    )}

                    <input
                      type="checkbox"
                      checked={!!completed}
                      onChange={() =>
                        toggleLesson(lesson.id, completed)
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
