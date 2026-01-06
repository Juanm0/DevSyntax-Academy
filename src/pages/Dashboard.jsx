/* 

import { useState } from "react";
import { createCourse } from "../services/course.service";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [learn, setLearn] = useState("");
  const [requirements, setRequirements] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createCourse({
        title,
        description,
        what_you_will_learn: learn.split("\n").filter(Boolean),
        requirements: requirements.split("\n").filter(Boolean),
      });

      setSuccess("Curso creado correctamente");

      // limpiar formulario
      setTitle("");
      setDescription("");
      setLearn("");
      setRequirements("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Panel de administración</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Qué vas a aprender (uno por línea)</label>
          <textarea
            value={learn}
            onChange={(e) => setLearn(e.target.value)}
            placeholder="HTML semántico
CSS moderno
Flexbox y Grid"
          />
        </div>

        <div>
          <label>Requisitos (uno por línea)</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="PC o notebook
Ganas de aprender"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear curso"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

 */





/* 

import { useEffect, useState } from "react";
import {
  createCourse,
  getAllCourses,
  updateCourse,
} from "../services/course.service";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [learn, setLearn] = useState("");
  const [requirements, setRequirements] = useState("");
  const [stack, setStack] = useState("");
  const [level, setLevel] = useState("Intermedio");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("Español");
  const [coverImage, setCoverImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      const data = await getAllCourses();
      setCourses(data);
    }
    loadCourses();
  }, []);

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setLearn("");
    setRequirements("");
    setStack("");
    setDuration("");
    setCoverImage("");
    setLevel("Intermedio");
    setLanguage("Español");
  };

  const handleEditSelect = (course) => {
    setSelectedId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setLearn(course.what_you_will_learn?.join("\n") || "");
    setRequirements(course.requirements?.join("\n") || "");
    setStack(course.stack?.join("\n") || "");
    setLevel(course.level || "Intermedio");
    setDuration(course.duration || "");
    setLanguage(course.language || "Español");
    setCoverImage(course.cover_image || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      title,
      description,
      level,
      duration,
      language,
      cover_image: coverImage || null,
      what_you_will_learn: learn.split("\n").filter(Boolean),
      requirements: requirements.split("\n").filter(Boolean),
      stack: stack.split("\n").filter(Boolean),
    };

    try {
      if (selectedId) {
        await updateCourse(selectedId, payload);
        setMessage("Curso actualizado correctamente");
      } else {
        await createCourse(payload);
        setMessage("Curso creado correctamente");
      }

      resetForm();
    } catch (err) {
      setMessage("Error al guardar el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Dashboard de cursos</h1>

      {/* LISTA }
      <section>
        <h3>Cursos existentes</h3>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <button onClick={() => handleEditSelect(course)}>
                ✏️ Editar
              </button>{" "}
              {course.title}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* FORM }
      <form onSubmit={handleSubmit}>
        <h3>{selectedId ? "Editar curso" : "Crear curso"}</h3>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>Principiante</option>
          <option>Intermedio</option>
          <option>Avanzado</option>
        </select>

        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duración" />
        <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Idioma" />
        <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="URL imagen" />

        <textarea value={learn} onChange={(e) => setLearn(e.target.value)} placeholder="Qué vas a aprender (uno por línea)" />
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requisitos" />
        <textarea value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Stack" />

        <button disabled={loading}>
          {loading ? "Guardando..." : selectedId ? "Actualizar curso" : "Crear curso"}
        </button>

        {selectedId && (
          <button type="button" onClick={resetForm}>
            Cancelar edición
          </button>
        )}
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  createCourse,
  getAllCourses,
  updateCourse,
} from "../services/course.service";

export default function Dashboard() {
  const navigate = useNavigate();

  /* AUTH */
  const [user, setUser] = useState(null);

  /* ADMIN */
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [learn, setLearn] = useState("");
  const [requirements, setRequirements] = useState("");
  const [stack, setStack] = useState("");
  const [level, setLevel] = useState("Intermedio");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("Español");
  const [coverImage, setCoverImage] = useState("");

  /* ALUMNO */
  const [myCourses, setMyCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);

      /* ADMIN: todos los cursos */
      const allCourses = await getAllCourses();
      setCourses(allCourses || []);

      /* ALUMNO: cursos inscritos */
      const { data: enrolled } = await supabase
        .from("enrollments")
        .select(`
          course_id,
          courses (
            id,
            title,
            description
          )
        `)
        .eq("user_id", user.id);

      const mapped = enrolled?.map((e) => e.courses).filter(Boolean) || [];
      setMyCourses(mapped);
    }

    loadDashboard();
  }, [navigate]);

  /* ================= ADMIN ================= */

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setLearn("");
    setRequirements("");
    setStack("");
    setDuration("");
    setCoverImage("");
    setLevel("Intermedio");
    setLanguage("Español");
  };

  const handleEditSelect = (course) => {
    setSelectedId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setLearn(course.what_you_will_learn?.join("\n") || "");
    setRequirements(course.requirements?.join("\n") || "");
    setStack(course.stack?.join("\n") || "");
    setLevel(course.level || "Intermedio");
    setDuration(course.duration || "");
    setLanguage(course.language || "Español");
    setCoverImage(course.cover_image || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      title,
      description,
      level,
      duration,
      language,
      cover_image: coverImage || null,
      what_you_will_learn: learn.split("\n").filter(Boolean),
      requirements: requirements.split("\n").filter(Boolean),
      stack: stack.split("\n").filter(Boolean),
    };

    try {
      if (selectedId) {
        await updateCourse(selectedId, payload);
        setMessage("Curso actualizado correctamente");
      } else {
        await createCourse(payload);
        setMessage("Curso creado correctamente");
      }

      const updated = await getAllCourses();
      setCourses(updated || []);
      resetForm();
    } catch (err) {
      setMessage("Error al guardar el curso");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1>Dashboard</h1>

      {/* ====== ALUMNO ====== */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Mis cursos</h2>

        {myCourses.length === 0 ? (
          <p>No estás haciendo ningún curso actualmente.</p>
        ) : (
          <ul>
            {myCourses.map((course) => (
              <li key={course.id} style={{ marginBottom: "1rem" }}>
                <strong>{course.title}</strong>
                <p>{course.description}</p>
                <Link to={`/course/${course.id}`}>
                  <button>Ir al curso</button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      {/* ====== ADMIN ====== */}
      <section>
        <h2>Administración de cursos</h2>

        <h3>Cursos existentes</h3>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <button onClick={() => handleEditSelect(course)}>✏️</button>{" "}
              {course.title}
            </li>
          ))}
        </ul>

        <hr />

        <form onSubmit={handleSubmit}>
          <h3>{selectedId ? "Editar curso" : "Crear curso"}</h3>

          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />

          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>

          <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duración" />
          <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Idioma" />
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="URL imagen" />

          <textarea value={learn} onChange={(e) => setLearn(e.target.value)} placeholder="Qué vas a aprender (uno por línea)" />
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requisitos" />
          <textarea value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Stack" />

          <button disabled={loading}>
            {loading ? "Guardando..." : selectedId ? "Actualizar curso" : "Crear curso"}
          </button>

          {selectedId && (
            <button type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </form>

        {message && <p>{message}</p>}
      </section>
    </main>
  );
}
