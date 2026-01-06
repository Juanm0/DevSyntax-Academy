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
