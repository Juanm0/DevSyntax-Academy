import { supabase } from "./supabaseClient";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Crear perfil del usuario
  const user = data.user;

  if (user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: fullName,
      });

    if (profileError) throw profileError;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
