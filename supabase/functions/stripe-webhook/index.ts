import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-06-20",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !webhookSecret) {
      return new Response("Missing signature or webhook secret", {
        status: 400,
      });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;

          // Determine plan from price ID
          let planName = "pro";
          if (priceId === Deno.env.get("STRIPE_BUSINESS_PRICE_ID")) {
            planName = "business";
          }

          // Update user profile
          await supabase
            .from("profiles")
            .update({
              subscription_plan: planName,
              subscription_status: "active",
              subscription_level: planName,
              subscription_started_at: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              subscription_expires_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", userId);

          // Create invoice record
          await supabase.from("invoices").insert({
            user_id: userId,
            invoice_number: `INV-${Date.now().toString(36).toUpperCase()}`,
            plan_name: planName,
            amount: subscription.items.data[0]?.price.unit_amount
              ? subscription.items.data[0].price.unit_amount / 100
              : 0,
            currency: subscription.items.data[0]?.price.currency || "usd",
            status: "paid",
            paid_at: new Date().toISOString(),
            description: `${planName} plan subscription`,
            billing_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            billing_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            stripe_invoice_id: subscriptionId,
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        // Find user by Stripe customer ID
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].user_id;

          // Get subscription details for period
          if (subscriptionId) {
            const subscription =
              await stripe.subscriptions.retrieve(subscriptionId);

            await supabase.from("invoices").insert({
              user_id: userId,
              invoice_number: `INV-${invoice.number || Date.now().toString(36).toUpperCase()}`,
              plan_name: "pro",
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency || "usd",
              status: "paid",
              paid_at: new Date().toISOString(),
              description: `Subscription payment`,
              billing_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              billing_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              stripe_invoice_id: invoice.id,
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].user_id;
          const status =
            subscription.status === "active" ? "active" : "inactive";

          await supabase
            .from("profiles")
            .update({
              subscription_status: status,
              subscription_expires_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        if (profiles && profiles.length > 0) {
          const userId = profiles[0].user_id;

          await supabase
            .from("profiles")
            .update({
              subscription_plan: "starter",
              subscription_status: "expired",
              subscription_level: "starter",
              subscription_expires_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("stripe-webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
