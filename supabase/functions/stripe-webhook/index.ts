// supabase/functions/stripe-webhook/index.ts
//
// Stripe llama a esta función cuando el pago se confirma.
// Marca la inscripción como "paid" en la tabla enrollments.
//
// Configurá esta URL como webhook endpoint en el dashboard de Stripe:
// https://<tu-proyecto>.supabase.co/functions/v1/stripe-webhook
// Evento a escuchar: checkout.session.completed

import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature inválida:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.course_id;
    const userId = session.metadata?.user_id;

    if (courseId && userId) {
      await supabaseAdmin
        .from("enrollments")
        .update({
          status: "paid",
          amount_paid: (session.amount_total ?? 0) / 100,
          currency: session.currency,
          paid_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("course_id", courseId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
