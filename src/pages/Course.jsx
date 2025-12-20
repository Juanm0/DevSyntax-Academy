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

      if (!error) setCourse(data);
      setLoading(false);
    }

    loadCourse();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!course) return <p>Curso no encontrado</p>;

  return (
    <div className="course-page">
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h2>Qué vas a aprender</h2>
      {course.what_you_will_learn?.length ? (
        <ul>
          {course.what_you_will_learn.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No especificado</p>
      )}

      <h2>Requisitos</h2>
      {course.requirements?.length ? (
        <ul>
          {course.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      ) : (
        <p>No tiene requisitos</p>
      )}
    </div>
  );
}