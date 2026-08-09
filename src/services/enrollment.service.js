import { supabase } from "./supabaseClient";

export async function enrollInCourse(courseId) {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("NO_AUTH");
  }

  const { error } = await supabase.from("enrollments").insert({
    user_id: userData.user.id,
    course_id: courseId,
  });

  if (error && error.code !== "23505") {
    throw error;
  }
}

// Devuelve el status de inscripción del usuario actual para un curso:
// "paid" | "pending" | null (null = no inscripto todavía)
export async function getEnrollmentStatus(courseId) {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return null;

  const { data, error } = await supabase
    .from("enrollments")
    .select("status")
    .eq("user_id", userData.user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) throw error;

  return data?.status ?? null;
}
