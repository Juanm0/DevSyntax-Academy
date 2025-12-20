/* import { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../services/course.service";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async () => {
    if (!title) return;
    await createCourse({ title });
    setTitle("");
    loadCourses();
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    loadCourses();
  };

  return (
    <div className="container">
      <h1>Panel de cursos</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nuevo curso"
        />
        <Button onClick={handleCreate}>Crear</Button>
      </div>

      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            {c.title}
            <button onClick={() => handleDelete(c.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
} */

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



