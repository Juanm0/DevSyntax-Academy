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

