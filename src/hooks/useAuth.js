import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

async function loadProfile(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Carga inicial de la sesión al montar.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const profileData = await loadProfile(currentUser.id);
        if (isMounted) setProfile(profileData);
      }

      if (isMounted) setLoading(false);
    });

    // IMPORTANTE: nunca hacer `await` de llamadas a Supabase directamente
    // dentro de onAuthStateChange. Es un bug/anti-patrón conocido de
    // supabase-js que deja el cliente en deadlock (cualquier llamada
    // posterior a Supabase se cuelga para siempre). Por eso usamos la
    // `session` que ya viene en el propio callback y diferimos cualquier
    // llamada adicional con setTimeout, tal como recomienda Supabase.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          loadProfile(currentUser.id).then((profileData) => {
            if (isMounted) setProfile(profileData);
          });
        } else {
          setProfile(null);
        }

        setLoading(false);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
