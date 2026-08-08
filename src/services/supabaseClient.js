import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Supabase recomienda pausar el refresco automático del token cuando la
// pestaña no está visible y reanudarlo al volver. Esto reduce la chance de
// que el timer de refresco dispare mientras la pestaña está en segundo
// plano (justo el escenario que dispara el deadlock conocido de
// supabase-js: https://github.com/orgs/supabase/discussions o el
// troubleshooting oficial "why is my supabase api call not returning").
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
