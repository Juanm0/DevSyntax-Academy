/* import { supabase } from "./supabaseClient";

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCourse(course) {
  const { error } = await supabase.from("courses").insert(course);
  if (error) throw error;
}

export async function deleteCourse(id) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}
 */

/* import { supabase } from "./supabaseClient";

export async function createCourse({ title, description }) {
  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        title,
        description,
        is_published: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
} */


import { supabase } from "./supabaseClient";

/* ======================
   ADMIN
====================== */

export async function createCourse(course) {
  const payload = {
    ...course,          // title, description, arrays, lo que venga
    is_published: false // forzado desde el backend
  };

  const { data, error } = await supabase
    .from("courses")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function publishCourse(courseId, value) {
  const { error } = await supabase
    .from("courses")
    .update({ is_published: value })
    .eq("id", courseId);

  if (error) throw error;
}

/* ======================
   PUBLIC / ALUMNOS
====================== */

export async function getPublishedCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



/* ======================
   UPTADE CURSOS / CREATE CURSOS
====================== */

export async function getAllCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateCourse(id, updates) {
  const { error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
