import { supabase } from "../services/supabaseClient";

supabase.auth.getSession().then(console.log);
