// supabase/functions/create-checkout-session/index.ts
//
// Crea una sesión de Stripe Checkout para comprar un curso.
// El frontend llama a esta función con { courseId } y recibe { url },
// a donde tiene que redirigir al usuario (window.location.href = url).

import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return new Response(JSON.stringify({ error: "courseId requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente con el JWT del usuario que llama, para saber quién es
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "No autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Traemos el curso con el service role (bypassa RLS, solo lectura acá)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id, title, price, currency, is_published")
      .eq("id", courseId)
      .single();

    if (courseError || !course || !course.is_published) {
      return new Response(JSON.stringify({ error: "Curso no encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!course.price || course.price <= 0) {
      return new Response(
        JSON.stringify({ error: "Este curso no tiene precio configurado" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Moneda: usá la del curso si la cargaste en Supabase, sino USD por defecto.
    // Stripe espera el monto en la unidad mínima (centavos).
    const currency = (course.currency || "usd").toLowerCase();
    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: course.title },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        course_id: course.id,
        user_id: user.id,
      },
      success_url: `${siteUrl}/pago-exitoso?course=${course.id}`,
      cancel_url: `${siteUrl}/course/${course.id}?pago=cancelado`,
    });

    // Guardamos una inscripción "pending" con el session id para poder
    // conciliarla cuando llegue el webhook.
    await supabaseAdmin.from("enrollments").upsert(
      {
        user_id: user.id,
        course_id: course.id,
        status: "pending",
        stripe_session_id: session.id,
      },
      { onConflict: "user_id,course_id" }
    );

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
